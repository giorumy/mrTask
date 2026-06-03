import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TaskGenerationService {
  private readonly logger = new Logger(TaskGenerationService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async generateDailyTasks() {
    this.logger.log('Running daily task generation...');
    await this.generateDepartureTasks();
    await this.generateArrivalTasks();
    await this.generateRecurringTasks();
  }

  async generateDepartureTasks() {
    const todayStr = new Date().toISOString().split('T')[0]; // "2026-06-03"
    const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0]; // "2026-06-04"

    const departures = await this.prisma.reservation.findMany({
    where: {
        guestDeparture: {
        gte: new Date(`${todayStr}T00:00:00.000Z`),
        lt: new Date(`${tomorrowStr}T00:00:00.000Z`),
        },
    },
    include: { property: true },
    });

    this.logger.log(`Looking for departures between ${todayStr} and ${tomorrowStr}`);
    this.logger.log(`Found ${departures.length} departures`);

    const templates = await this.prisma.taskTemplate.findMany({
      where: { triggerType: 'DEPARTURE', isActive: true },
      include: { properties: true },
    });

    let created = 0;
    for (const reservation of departures) {
      for (const template of templates) {
        const appliesToProperty = template.properties.some(
          (p) => p.propertyId === reservation.propertyId,
        );
        if (!appliesToProperty) continue;

        // Check if task already exists
        const existing = await this.prisma.task.findFirst({
          where: {
            templateId: template.id,
            propertyId: reservation.propertyId,
            dueDate: { gte: new Date(`${todayStr}T00:00:00.000Z`), lt: new Date(`${tomorrowStr}T00:00:00.000Z`) },
          },
        });
        if (existing) continue;

        await this.prisma.task.create({
          data: {
            title: template.name,
            taskType: template.taskType,
            propertyId: reservation.propertyId,
            templateId: template.id,
            bookingId: reservation.id,
            assignedTo: template.defaultAssigneeId ?? undefined,
            dueDate: reservation.guestDeparture,
            checklistItems: template.checklistItems ?? undefined,
          },
        });
        created++;
      }
    }

    this.logger.log(`Generated ${created} departure tasks`);
    return created;
  }

  async generateArrivalTasks() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Find reservations arriving today
    const arrivals = await this.prisma.reservation.findMany({
      where: {
        guestArrival: { gte: today, lt: tomorrow },
      },
      include: { property: true },
    });

    const templates = await this.prisma.taskTemplate.findMany({
      where: { triggerType: 'ARRIVAL', isActive: true },
      include: { properties: true },
    });

    let created = 0;
    for (const reservation of arrivals) {
      for (const template of templates) {
        const appliesToProperty = template.properties.some(
          (p) => p.propertyId === reservation.propertyId,
        );
        if (!appliesToProperty) continue;

        const existing = await this.prisma.task.findFirst({
          where: {
            templateId: template.id,
            propertyId: reservation.propertyId,
            dueDate: { gte: today, lt: tomorrow },
          },
        });
        if (existing) continue;

        await this.prisma.task.create({
          data: {
            title: template.name,
            taskType: template.taskType,
            propertyId: reservation.propertyId,
            templateId: template.id,
            bookingId: reservation.id,
            assignedTo: template.defaultAssigneeId ?? undefined,
            dueDate: reservation.guestArrival,
            checklistItems: template.checklistItems ?? undefined,
          },
        });
        created++;
      }
    }

    this.logger.log(`Generated ${created} arrival tasks`);
    return created;
  }

  async generateRecurringTasks() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const templates = await this.prisma.taskTemplate.findMany({
      where: {
        triggerType: 'RECURRING',
        isActive: true,
        recurrenceIntervalDays: { not: null },
      },
      include: { properties: true },
    });

    let created = 0;
    for (const template of templates) {
      for (const templateProperty of template.properties) {
        // Check recurrence log
        const log = await this.prisma.taskRecurrenceLog.findFirst({
          where: {
            templateId: template.id,
            propertyId: templateProperty.propertyId,
          },
        });

        const isDue = !log || new Date(log.nextDueDate) <= today;
        if (!isDue) continue;

        const nextDueDate = new Date(today);
        nextDueDate.setDate(today.getDate() + template.recurrenceIntervalDays!);

        await this.prisma.task.create({
          data: {
            title: template.name,
            taskType: template.taskType,
            propertyId: templateProperty.propertyId,
            templateId: template.id,
            assignedTo: template.defaultAssigneeId ?? undefined,
            dueDate: today,
            checklistItems: template.checklistItems ?? undefined,
          },
        });

        await this.prisma.taskRecurrenceLog.upsert({
          where: {
            id: log?.id ?? '',
          },
          update: {
            lastGeneratedAt: today,
            nextDueDate,
          },
          create: {
            templateId: template.id,
            propertyId: templateProperty.propertyId,
            lastGeneratedAt: today,
            nextDueDate,
          },
        });

        created++;
      }
    }

    this.logger.log(`Generated ${created} recurring tasks`);
    return created;
  }
}