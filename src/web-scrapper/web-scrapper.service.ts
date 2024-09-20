import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Raw, Repository } from 'typeorm';
import { Conversion } from './entities/conversion.entity';
import { Currency } from './entities/currency.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ScrapperService {
  constructor(
    @InjectRepository(Conversion)
    private conversionRepository: Repository<Conversion>,
    @InjectRepository(Currency)
    private currencyRepository: Repository<Currency>,
    private readonly configService: ConfigService,
  ) {}

  async getConversionRates(): Promise<any> {
    const api = this.configService.get('config.api');
    const api_url = api.url;
    const query = `
      query getCountryConversions($countryCode: String!) {
        getCountryConversions(payload: {countryCode: $countryCode}) {
          baseCurrency {
            code
            name
          }
          conversionRates {
          baseValue
          official
          principal
            rateCurrency {
              code
            }
            rateValue
          }
        }
      }
    `;

    const variables = {
      countryCode: 'VE',
    };

    try {
      const today = new Date();

      const todayString = today.toISOString().split('T')[0];

      const existingConversion = await this.conversionRepository.find({
        where: {
          createdAt: Raw(
            (alias) => `DATE(${alias}) = :date`,
            { date: todayString }, // Compara solo la fecha, sin la hora
          ),
        },
      });

      if (existingConversion.length > 0) {
        return {
          data: existingConversion,
        };
      }

      const response = await axios.post(
        api_url,
        {
          query,
          variables,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data.errors) {
        throw new InternalServerErrorException(response.data.errors);
      }

      const { baseCurrency, conversionRates } =
        response.data.data.getCountryConversions;

      const usdConversionRates = conversionRates.filter(
        (rate) => rate.rateCurrency.code === 'USD',
      );

      for (const rate of usdConversionRates) {
        const currencyCode = rate.rateCurrency.code;

        let currency = await this.currencyRepository.findOne({
          where: { sufix: currencyCode },
        });

        if (!currency) {
          console.log(
            `Currency not found. Creating new currency: ${currencyCode}`,
          );
          const newCurrency = new Currency();
          newCurrency.sufix = currencyCode;
          newCurrency.title = 'Dollar';

          currency = await this.currencyRepository.save(newCurrency);
          console.log('New Currency saved:', currency);
        } else {
          console.log('Currency fetched:', currency);
        }

        const conversionExists = existingConversion.some(
          (conversion) =>
            conversion.value === rate.baseValue &&
            conversion.currency.id === currency.id,
        );

        if (!conversionExists) {
          const newConversion = new Conversion();
          newConversion.currency = currency;

          newConversion.value = rate.baseValue;
          await this.conversionRepository.save(newConversion);
        }
      }

      return {
        baseCurrency,
        usdConversionRates,
      };
    } catch (error) {
      if (error.code === 'ETIMEDOUT' || error.code === 'ENETUNREACH') {
        // Lógica para manejar el tiempo de espera o redes inaccesibles
        console.error('Error de conectividad:', error.message);
      } else {
        console.error('Error al ejecutar getConversionRates', error);
        throw new InternalServerErrorException(
          'Error al obtener las tasas de conversión.',
        );
      }
    }
  }
}
