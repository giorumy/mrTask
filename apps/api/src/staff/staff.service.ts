import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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

  create(data: { name: string; pin: string }) {
    return this.prisma.user.create({
      data: { ...data, role: 'STAFF' },
      select: { id: true, name: true, role: true, createdAt: true },
    });
  }

  update(id: string, data: { name?: string; pin?: string }) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, role: true, createdAt: true },
    });
  }

  remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}