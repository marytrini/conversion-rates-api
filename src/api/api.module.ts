import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { ConfigService } from '@nestjs/config';

@Module({
    imports:[],
    providers:[ApiService, ConfigService],
})
export class ApiModule {}
