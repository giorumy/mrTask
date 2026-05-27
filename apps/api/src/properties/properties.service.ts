import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { encrypt, decrypt } from '../common/encryption';

@Injectable()
export class PropertiesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const properties = await this.prisma.property.findMany({
      orderBy: { name: 'asc' },
    });
    return properties.map((p) => this.decryptProperty(p));
  }

  async findOne(id: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
      include: {
        reservations: {
          where: { guestArrival: { gte: new Date() } },
          orderBy: { guestArrival: 'asc' },
          take: 5,
        },
        tasks: {
          where: { status: { not: 'COMPLETED' } },
          orderBy: { dueDate: 'asc' },
        },
      },
    });
    if (!property) return null;
    return this.decryptProperty(property);
  }

  async update(id: string, data: { wifiPassword?: string; doorPin?: string }) {
    const updateData: any = {};
    if (data.wifiPassword) updateData.wifiPassword = encrypt(data.wifiPassword);
    if (data.doorPin) updateData.doorPin = encrypt(data.doorPin);

    const property = await this.prisma.property.update({
      where: { id },
      data: updateData,
    });
    return this.decryptProperty(property);
  }

  private decryptProperty(property: any) {
    return {
      ...property,
      wifiPassword: property.wifiPassword ? decrypt(property.wifiPassword) : null,
      doorPin: property.doorPin ? decrypt(property.doorPin) : null,
    };
  }
}