import { Test, TestingModule } from '@nestjs/testing';
import { SittingController } from './sitting.controller';

describe('SittingController', () => {
  let controller: SittingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SittingController],
    }).compile();

    controller = module.get<SittingController>(SittingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
