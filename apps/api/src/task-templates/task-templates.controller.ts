import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { TaskTemplatesService } from './task-templates.service';
import { TaskType } from '@prisma/client';

@Controller('task-templates')
export class TaskTemplatesController {
  constructor(private readonly taskTemplatesService: TaskTemplatesService) {}

  @Get()
  findAll() {
    return this.taskTemplatesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskTemplatesService.findOne(id);
  }

  @Post()
  create(@Body() body: { name: string; type: TaskType; recurrence?: string; isActive?: boolean }) {
    return this.taskTemplatesService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.taskTemplatesService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskTemplatesService.remove(id);
  }

  @Post(':id/apply')
  apply(@Param('id') id: string, @Body() body: { propertyId: string; assigneeId?: string; dueDate: string }) {
    return this.taskTemplatesService.applyTemplate(id, body);
  }
}