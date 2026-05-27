import { Test, TestingModule } from '@nestjs/testing';
import { OwnerrezService } from './ownerrez.service';

describe('OwnerrezService', () => {
  let service: OwnerrezService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OwnerrezService],
    }).compile();

    service = module.get<OwnerrezService>(OwnerrezService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
