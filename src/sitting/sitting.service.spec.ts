import { Test, TestingModule } from '@nestjs/testing';
import { SittingService } from './sitting.service';

describe('SittingService', () => {
  let service: SittingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SittingService],
    }).compile();

    service = module.get<SittingService>(SittingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
