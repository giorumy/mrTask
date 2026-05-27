import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('staff/login')
  staffLogin(@Body() body: { pin: string }) {
    return this.authService.staffLogin(body.pin);
  }
}