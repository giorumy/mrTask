import { Test, TestingModule } from '@nestjs/testing';
import { OwnerrezController } from './ownerrez.controller';

describe('OwnerrezController', () => {
  let controller: OwnerrezController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OwnerrezController],
    }).compile();

    controller = module.get<OwnerrezController>(OwnerrezController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
