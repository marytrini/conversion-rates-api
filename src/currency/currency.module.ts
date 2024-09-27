import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversion } from 'src/web-scrapper/entities/conversion.entity';
import { Currency } from 'src/web-scrapper/entities/currency.entity';
import { CurrencyService } from './currency.service';

@Module({
    imports: [TypeOrmModule.forFeature([Currency,Conversion])],
    providers:[CurrencyService],
})
export class CurrencyModule {}
