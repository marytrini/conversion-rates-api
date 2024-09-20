import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { ScrapperService } from './web-scrapper.service';

@Controller('conversion-rates')
export class WebScrapperController {
  constructor(private readonly scrapperService: ScrapperService) {}

  @Get()
  async getConversionRates() {
    return this.scrapperService.getConversionRates();
  }
}
