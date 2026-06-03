import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StaffRole } from '@prisma/client';
import { createClerkClient } from '@clerk/backend';

@Injectable()
export class StaffService {
  private clerk = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  });

  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.staffMember.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, email: true, role: true, clerkId: true, createdAt: true },
    });
  }

  findOne(id: string) {
    return this.prisma.staffMember.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true, clerkId: true, createdAt: true },
    });
  }

  async create(data: { name: string; email: string; role?: StaffRole }) {
    // Check for duplicates
    const existing = await this.prisma.staffMember.findFirst({
      where: { OR: [{ email: data.email }, { name: data.name }] },
    });
    if (existing) {
      throw new BadRequestException('A staff member with this name or email already exists');
    }

    // Create staff member in DB first
    const staff = await this.prisma.staffMember.create({
      data: { ...data },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    // Send Clerk invitation
    try {
      await this.clerk.invitations.createInvitation({
        emailAddress: data.email,
        redirectUrl: `${process.env.FRONTEND_URL}/staff/tasks`,
        publicMetadata: { staffId: staff.id, role: 'STAFF' },
      });
    } catch (error) {
      // If invitation fails, still return the staff member
      console.error('Failed to send Clerk invitation:', error);
    }

    return staff;
  }

  async update(id: string, data: { name?: string; email?: string; role?: StaffRole }) {
    return this.prisma.staffMember.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
  }

  async linkClerkId(clerkId: string, email: string) {
    return this.prisma.staffMember.update({
      where: { email },
      data: { clerkId },
    });
  }

  remove(id: string) {
    return this.prisma.staffMember.delete({ where: { id } });
  }
}