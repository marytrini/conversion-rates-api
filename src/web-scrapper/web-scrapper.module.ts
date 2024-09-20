import { Module } from '@nestjs/common';
import { ScrapperService } from './web-scrapper.service';
import { WebScrapperController } from './web-scrapper.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversion } from './entities/conversion.entity';
import { Currency } from './entities/currency.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Conversion, Currency])],
  providers: [ScrapperService, ConfigService],
  controllers: [WebScrapperController],
})
export class WebScrapperModule {}
