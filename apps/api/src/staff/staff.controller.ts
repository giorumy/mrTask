import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffRole } from '@prisma/client';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get()
  findAll() {
    return this.staffService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staffService.findOne(id);
  }

  @Post()
  create(@Body() body: { name: string; email: string; role?: StaffRole }) {
    return this.staffService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: { name?: string; email?: string; role?: StaffRole }) {
    return this.staffService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.staffService.remove(id);
  }
}