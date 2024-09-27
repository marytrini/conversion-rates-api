import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class ApiService {
    constructor( private readonly configService: ConfigService) {}

    async fetchConversionRates(): Promise<any> {
      const api = this.configService.get('config.api');
      const api_url = api.url;
      const query = api.query;

      const variables = {
        countryCode: 'VE',
      };
      try {
    const response = await axios.post(
        api_url,
        {
            query,
            variables,
        },
        {
            headers: {
                'Content-Type': 'application/json',
            },
        },
    );
    if (response.data.errors) {
        throw new InternalServerErrorException(response.data.errors);
    }
    return response;
      } catch (error) {
        this.handleApiError(error)        
      }
    }
    private handleApiError(error: any) {
        if (error.code === 'ETIMEDOUT' || error.code === 'ENETUNREACH') {
          console.error('Error de conectividad:', error.message);
        } else {
          console.error('Error en la llamada a la API', error);
          throw new InternalServerErrorException('Error al obtener las tasas de conversión.');
        }
      }
}
