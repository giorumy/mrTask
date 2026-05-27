import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async staffLogin(pin: string) {
    const staffMembers = await this.prisma.user.findMany({
      where: { role: 'STAFF' },
      select: { id: true, name: true, pin: true, role: true },
    });

    for (const staff of staffMembers) {
      if (!staff.pin) continue;
      const match = await bcrypt.compare(pin, staff.pin);
      if (match) {
        const token = this.jwt.sign({
          sub: staff.id,
          name: staff.name,
          role: staff.role,
        });
        return { token, staff: { id: staff.id, name: staff.name } };
      }
    }

    throw new UnauthorizedException('Invalid PIN');
  }
}