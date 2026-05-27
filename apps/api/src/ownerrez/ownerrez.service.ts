import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OwnerrezService {
  private readonly logger = new Logger(OwnerrezService.name);
  private readonly baseUrl = 'https://api.ownerrez.com/v2';
  private readonly auth: string;

  constructor(private readonly httpService: HttpService) {
    this.auth = Buffer.from(
      `${process.env.OWNERREZ_USERNAME}:${process.env.OWNERREZ_TOKEN}`,
    ).toString('base64');
  }
  private getHeaders() {
    return {
        Authorization: `Basic ${this.auth}`,
        'Content-Type': 'application/json',
        'User-Agent': 'MrTask/1.0',
    };
  }
  async getProperties() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/properties`, {
          headers: this.getHeaders(),
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Failed to fetch properties from OwnerRez', error);
      throw error;
    }
  }

  async getReservations() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/bookings`, {
          headers: this.getHeaders(),
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Failed to fetch reservations from OwnerRez', error);
      throw error;
    }
  }
}