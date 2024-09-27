import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import { Conversion } from './entities/conversion.entity';
import { ConfigService } from '@nestjs/config';
import { CurrencyService } from '../currency/currency.service'; 
import { ApiService } from '../api/api.service'; 

@Injectable()
export class ScrapperService {
  constructor(
    @InjectRepository(Conversion)
    private conversionRepository: Repository<Conversion>,
    private readonly currencyService: CurrencyService, 
    private readonly apiService: ApiService, 
  ) {}

  async getConversionRates(): Promise<any> {
    const todayString = this.getTodayString();

    const existingConversion = await this.getExistingConversions(todayString);

    if (existingConversion.length > 0) {
      return {
        data: existingConversion,
      };
    }

    const apiResponse = await this.apiService.fetchConversionRates();

    const { baseCurrency, conversionRates } = apiResponse.data.data.getCountryConversions;

    const usdConversionRates = conversionRates.filter(
      (rate) => rate.rateCurrency.code === 'USD',
    );

    for (const rate of usdConversionRates) {
      await this.currencyService.processConversion(rate, existingConversion);
    }

    return {
      baseCurrency,
      usdConversionRates,
    };
  }

  private getTodayString(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  private async getExistingConversions(todayString: string): Promise<Conversion[]> {
    return this.conversionRepository.find({
      where: {
        createdAt: Raw(
          (alias) => `DATE(${alias}) = :date`,
          { date: todayString }, // Compara solo la fecha, sin la hora
        ),
      },
    });
  }
}
