import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus, TaskType } from '@prisma/client';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(
    @Query('status') status?: TaskStatus,
    @Query('propertyId') propertyId?: string,
    @Query('assignedTo') assignedTo?: string,
  ) {
    return this.tasksService.findAll({ status, propertyId, assignedTo });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Post()
  create(@Body() body: any) {
    return this.tasksService.create(body);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: TaskStatus }) {
    return this.tasksService.updateStatus(id, body.status);
  }

  @Patch(':id/checklist')
  updateChecklist(@Param('id') id: string, @Body() body: { checklistItems: any[] }) {
    return this.tasksService.updateChecklist(id, body.checklistItems);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.tasksService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}