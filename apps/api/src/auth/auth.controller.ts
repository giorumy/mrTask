import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('staff/link')
  linkAndLogin(@Body() body: { clerkId: string; email: string }) {
    return this.authService.linkAndLogin(body.clerkId, body.email);
  }
}