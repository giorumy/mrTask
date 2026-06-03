import { Module } from '@nestjs/common';
import { TaskGenerationService } from './task-generation.service';
import { TaskGenerationController } from './task-generation.controller';

@Module({
  controllers: [TaskGenerationController],
  providers: [TaskGenerationService],
  exports: [TaskGenerationService],
})
export class TaskGenerationModule {}