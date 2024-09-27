import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { privateDecrypt } from 'crypto';
import { Conversion } from 'src/web-scrapper/entities/conversion.entity';
import { Currency } from 'src/web-scrapper/entities/currency.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CurrencyService {
    constructor(
        @InjectRepository(Currency)
        private currencyRepository: Repository<Currency>,
        @InjectRepository(Conversion)
        private conversionRepository: Repository<Conversion>,
    ) {}

    async processConversion(rate:any, existingConversion: Conversion[]): Promise<void> {
        const currencyCode = rate.rateCurrency.code;

        let currency = await this.currencyRepository.findOne({
            where: { sufix: currencyCode },
          });

        if (!currency) {
            console.log(`Currency not found. Creating new currency: ${currencyCode}`,);
            currency = await this.createCurrency(currencyCode);
        } else {
            console.log('Currency fetched:', currency);
        }
        const conversionExists = existingConversion.some(
        (conversion) => 
        conversion.value === rate.baseValue && 
        conversion.currency.id === currency.id,
    );
    if(!conversionExists) {
      await this.createConversion(rate, currency);
    }
    }
    private async createCurrency(currencyCode:string): Promise<Currency> {
     const newCurrency = new Currency();
     newCurrency.sufix = currencyCode;
     newCurrency.title = 'Dollar';
     return await this.currencyRepository.save(newCurrency);
    }
    private async createConversion(rate: any, currency: Currency): Promise<void> {
      const newConversion = new Conversion();
      newConversion.currency = currency;
      newConversion.value = rate.baseValue;
      await this.conversionRepository.save(newConversion);
    }
}
