import { Controller, Post } from '@nestjs/common';
import { TaskGenerationService } from './task-generation.service';

@Controller('task-generation')
export class TaskGenerationController {
  constructor(private readonly taskGenerationService: TaskGenerationService) {}

  @Post('run')
  run() {
    return this.taskGenerationService.generateDailyTasks();
  }

  @Post('departure')
  departure() {
    return this.taskGenerationService.generateDepartureTasks();
  }

  @Post('arrival')
  arrival() {
    return this.taskGenerationService.generateArrivalTasks();
  }

  @Post('recurring')
  recurring() {
    return this.taskGenerationService.generateRecurringTasks();
  }
}