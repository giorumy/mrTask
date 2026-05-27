import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TaskStatus, TaskType } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(filters?: { status?: TaskStatus; propertyId?: string; assigneeId?: string }) {
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
        property: true,
        assignee: { select: { id: true, name: true } },
        photos: true,
      },
    });
  }

  create(data: {
  title: string;
  type: TaskType;
  dueDate: string;
  propertyId: string;
  assigneeId?: string;
}) {
  // Parse date as local midnight to avoid timezone shift
  const [year, month, day] = data.dueDate.split('T')[0].split('-').map(Number);
  const dueDate = new Date(year, month - 1, day, 12, 0, 0); // noon local time

  return this.prisma.task.create({
    data: {
      ...data,
      dueDate,
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
      data: { status },
    });
  }

  update(id: string, data: Partial<{ title: string; type: TaskType; dueDate: string; assigneeId: string; status: TaskStatus }>) {
    return this.prisma.task.update({
      where: { id },
      data: {
        ...data,
        ...(data.dueDate && { dueDate: new Date(data.dueDate) }),
      },
    });
  }

  remove(id: string) {
    return this.prisma.task.delete({ where: { id } });
  }
}