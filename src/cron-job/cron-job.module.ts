import { Module } from '@nestjs/common';
import { CronJobService } from './cron-job.service';
import { ScrapperService } from 'src/web-scrapper/web-scrapper.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversion } from 'src/web-scrapper/entities/conversion.entity';
import { Currency } from 'src/web-scrapper/entities/currency.entity';
import { CurrencyService } from 'src/currency/currency.service';
import { ApiService } from 'src/api/api.service';

@Module({
  imports: [TypeOrmModule.forFeature([Conversion, Currency])],
  providers: [CronJobService, ScrapperService, ApiService, CurrencyService],
})
export class CronJobModule {}
