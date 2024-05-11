import { Test, TestingModule } from '@nestjs/testing';
import { WxOffiaccountService } from './wx-offiaccount.service';

describe('WxOffiaccountService', () => {
  let service: WxOffiaccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WxOffiaccountService],
    }).compile();

    service = module.get<WxOffiaccountService>(WxOffiaccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
