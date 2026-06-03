import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async staffLogin(clerkId: string) {
    const staff = await this.prisma.staffMember.findUnique({
      where: { clerkId },
      select: { id: true, name: true, role: true },
    });

    if (!staff) throw new UnauthorizedException('Staff member not found');

    const token = this.jwt.sign({
      sub: staff.id,
      name: staff.name,
      role: staff.role,
    });

    return { token, staff: { id: staff.id, name: staff.name } };
  }

  async linkAndLogin(clerkId: string, email: string) {
    let staff = await this.prisma.staffMember.findUnique({ where: { clerkId } });

    if (!staff) {
      // Try to link by email
      const byEmail = await this.prisma.staffMember.findUnique({ where: { email } });
      if (!byEmail) throw new UnauthorizedException('No staff account found for this email');

      staff = await this.prisma.staffMember.update({
        where: { email },
        data: { clerkId },
      });
    }

    const token = this.jwt.sign({
      sub: staff.id,
      name: staff.name,
      role: staff.role,
    });

    return { token, staff: { id: staff.id, name: staff.name } };
  }
}