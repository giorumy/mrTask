import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TaskType } from '@prisma/client';

@Injectable()
export class TaskTemplatesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.taskTemplate.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { tasks: true } } },
    });
  }

  findOne(id: string) {
    return this.prisma.taskTemplate.findUnique({
      where: { id },
      include: { tasks: { take: 5, orderBy: { createdAt: 'desc' } } },
    });
  }

  create(data: { name: string; type: TaskType; recurrence?: string; isActive?: boolean }) {
    return this.prisma.taskTemplate.create({ data });
  }

  update(id: string, data: { name?: string; type?: TaskType; recurrence?: string; isActive?: boolean }) {
    return this.prisma.taskTemplate.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.taskTemplate.delete({ where: { id } });
  }

  async applyTemplate(id: string, data: { propertyId: string; assigneeId?: string; dueDate: string }) {
    const template = await this.prisma.taskTemplate.findUnique({ where: { id } });
    if (!template) throw new Error('Template not found');

    const [year, month, day] = data.dueDate.split('T')[0].split('-').map(Number);
    const dueDate = new Date(year, month - 1, day, 12, 0, 0);

    return this.prisma.task.create({
      data: {
        title: template.name,
        type: template.type,
        propertyId: data.propertyId,
        assigneeId: data.assigneeId,
        templateId: id,
        dueDate,
      },
      include: {
        property: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true } },
      },
    });
  }
}