import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebScrapperModule } from './web-scrapper/web-scrapper.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { Conversion } from './web-scrapper/entities/conversion.entity';
import { Currency } from './web-scrapper/entities/currency.entity';
import { CronJobModule } from './cron-job/cron-job.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const configDb = configService.get('config.db');
        return {
          type: configDb.type as any,
          host: configDb.host,
          port: configDb.port,
          username: configDb.user,
          database: configDb.name,
          password: configDb.password,
          entities: [Conversion, Currency],
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Conversion, Currency]),
    WebScrapperModule,
    CronJobModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
