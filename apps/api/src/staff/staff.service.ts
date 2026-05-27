import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StaffService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      where: { role: 'STAFF' },
      orderBy: { name: 'asc' },
      select: { id: true, name: true, role: true, createdAt: true },
    });
  }

  async create(data: { name: string; pin: string }) {
    const hashedPin = await bcrypt.hash(data.pin, 10);
    return this.prisma.user.create({
      data: { name: data.name, pin: hashedPin, role: 'STAFF' },
      select: { id: true, name: true, role: true, createdAt: true },
    });
  }

  async update(id: string, data: { name?: string; pin?: string }) {
    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.pin) updateData.pin = await bcrypt.hash(data.pin, 10);
    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, name: true, role: true, createdAt: true },
    });
  }

  remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
        where: { id },
        select: { id: true, name: true, role: true, createdAt: true },
    });
}
}