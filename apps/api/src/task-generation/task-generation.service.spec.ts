import { Test, TestingModule } from '@nestjs/testing';
import { TaskGenerationService } from './task-generation.service';

describe('TaskGenerationService', () => {
  let service: TaskGenerationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskGenerationService],
    }).compile();

    service = module.get<TaskGenerationService>(TaskGenerationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
