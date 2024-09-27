import { Module } from '@nestjs/common';
import { ScrapperService } from './web-scrapper.service';
import { WebScrapperController } from './web-scrapper.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversion } from './entities/conversion.entity';
import { Currency } from './entities/currency.entity';
import { ApiService } from 'src/api/api.service';
import { CurrencyService } from 'src/currency/currency.service';

@Module({
  imports:[TypeOrmModule.forFeature([Conversion,Currency])],
  providers: [ScrapperService, ConfigService, ApiService, CurrencyService],
  controllers: [WebScrapperController],
})
export class WebScrapperModule {}
