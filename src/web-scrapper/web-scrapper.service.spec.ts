import { Test, TestingModule } from '@nestjs/testing';
import { WebScrapperService } from './web-scrapper.service';

describe('WebScrapperService', () => {
  let service: WebScrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebScrapperService],
    }).compile();

    service = module.get<WebScrapperService>(WebScrapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
