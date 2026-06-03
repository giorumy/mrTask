import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TaskStatus, TaskType } from '@prisma/client';

function parseDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('T')[0].split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0);
}

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(filters?: { status?: TaskStatus; propertyId?: string; assignedTo?: string }) {
    return this.prisma.task.findMany({
      where: filters,
      include: {
        property: { select: { id: true, name: true, coverImageUrl: true } },
        assignee: { select: { id: true, name: true } },
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  findOne(id: string) {
    return this.prisma.task.findUnique({
      where: { id },
      include: {
        property: { select: { id: true, name: true, coverImageUrl: true, address: true } },
        assignee: { select: { id: true, name: true } },
        template: { select: { id: true, name: true, triggerType: true } },
      },
    });
  }

  create(data: {
    title: string;
    taskType?: TaskType;
    dueDate: string;
    propertyId: string;
    assignedTo?: string;
    description?: string;
    checklistItems?: any[];
  }) {
    return this.prisma.task.create({
      data: {
        ...data,
        dueDate: parseDate(data.dueDate),
      },
      include: {
        property: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true } },
      },
    });
  }

  updateStatus(id: string, status: TaskStatus) {
    return this.prisma.task.update({
      where: { id },
      data: {
        status,
        ...(status === 'COMPLETED' ? { completedAt: new Date() } : { completedAt: null }),
      },
    });
  }

  updateChecklist(id: string, checklistItems: any[]) {
    return this.prisma.task.update({
      where: { id },
      data: { checklistItems },
    });
  }

  update(id: string, data: any) {
    return this.prisma.task.update({
      where: { id },
      data: {
        ...data,
        ...(data.dueDate && { dueDate: parseDate(data.dueDate) }),
      },
    });
  }

  remove(id: string) {
    return this.prisma.task.delete({ where: { id } });
  }
}