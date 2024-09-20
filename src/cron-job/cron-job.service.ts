import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ScrapperService } from 'src/web-scrapper/web-scrapper.service';

@Injectable()
export class CronJobService {
  constructor(private readonly scrapperService: ScrapperService) {}
  @Cron(CronExpression.EVERY_5_MINUTES, { timeZone: 'America/Caracas' })
  async getConversionRates() {
    try {
      const data = await this.scrapperService.getConversionRates();
      console.log('CronJob executed, data obtained: ', data);
    } catch (error) {
      console.error('Error executing Cronjob: ', error);
    }
  }
}
