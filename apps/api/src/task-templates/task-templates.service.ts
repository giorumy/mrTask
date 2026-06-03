import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TaskType, TriggerType } from '@prisma/client';

function parseDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('T')[0].split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0);
}

@Injectable()
export class TaskTemplatesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.taskTemplate.findMany({
      orderBy: { name: 'asc' },
      include: {
        properties: {
          include: { property: { select: { id: true, name: true } } },
        },
        defaultAssignee: { select: { id: true, name: true } },
        _count: { select: { tasks: true } },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.taskTemplate.findUnique({
      where: { id },
      include: {
        properties: {
          include: { property: { select: { id: true, name: true } } },
        },
        defaultAssignee: { select: { id: true, name: true } },
        tasks: { take: 5, orderBy: { createdAt: 'desc' } },
      },
    });
  }

  async create(data: {
    name: string;
    taskType?: TaskType;
    triggerType?: TriggerType;
    description?: string;
    recurrenceIntervalDays?: number;
    defaultAssigneeId?: string;
    propertyIds?: string[];
    checklistItems?: any[];
    isActive?: boolean;
  }) {
    const { propertyIds, ...rest } = data;

    return this.prisma.taskTemplate.create({
      data: {
        ...rest,
        properties: propertyIds
          ? {
              create: propertyIds.map((propertyId) => ({ propertyId })),
            }
          : undefined,
      },
      include: {
        properties: {
          include: { property: { select: { id: true, name: true } } },
        },
        defaultAssignee: { select: { id: true, name: true } },
      },
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      taskType?: TaskType;
      triggerType?: TriggerType;
      description?: string;
      recurrenceIntervalDays?: number;
      defaultAssigneeId?: string;
      propertyIds?: string[];
      checklistItems?: any[];
      isActive?: boolean;
    },
  ) {
    const { propertyIds, ...rest } = data;

    if (propertyIds !== undefined) {
      await this.prisma.taskTemplateProperty.deleteMany({
        where: { templateId: id },
      });
    }

    return this.prisma.taskTemplate.update({
      where: { id },
      data: {
        ...rest,
        properties: propertyIds
          ? {
              create: propertyIds.map((propertyId) => ({ propertyId })),
            }
          : undefined,
      },
      include: {
        properties: {
          include: { property: { select: { id: true, name: true } } },
        },
        defaultAssignee: { select: { id: true, name: true } },
      },
    });
  }

  remove(id: string) {
    return this.prisma.taskTemplate.delete({ where: { id } });
  }

  async applyTemplate(
    id: string,
    data: { propertyId: string; assignedTo?: string; dueDate: string },
  ) {
    const template = await this.prisma.taskTemplate.findUnique({ where: { id } });
    if (!template) throw new Error('Template not found');

    return this.prisma.task.create({
      data: {
        title: template.name,
        taskType: template.taskType,
        propertyId: data.propertyId,
        assignedTo: data.assignedTo ?? template.defaultAssigneeId ?? undefined,
        templateId: id,
        dueDate: parseDate(data.dueDate),
        checklistItems: template.checklistItems ?? undefined,
      },
      include: {
        property: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true } },
      },
    });
  }
}