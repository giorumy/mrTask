import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PropertiesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.property.findMany({
      orderBy: { name: 'asc' },
    });
  }

  findOne(id: string) {
    return this.prisma.property.findUnique({
      where: { id },
      include: {
        reservations: {
          where: {
            guestArrival: { gte: new Date() },
          },
          orderBy: { guestArrival: 'asc' },
          take: 5,
        },
        tasks: {
          where: {
            status: { not: 'COMPLETED' },
          },
          orderBy: { dueDate: 'asc' },
        },
      },
    });
  }

  update(id: string, data: { wifiPassword?: string; doorPin?: string }) {
    return this.prisma.property.update({
      where: { id },
      data,
    });
  }
}