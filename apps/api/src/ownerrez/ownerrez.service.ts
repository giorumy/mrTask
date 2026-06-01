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
      let allProperties: any[] = [];
      let offset = 0;
      const limit = 20;

      while (true) {
        const response = await firstValueFrom(
          this.httpService.get(`${this.baseUrl}/properties`, {
            headers: this.getHeaders(),
            params: { limit, offset },
          }),
        );

        const { items, count } = response.data;
        allProperties = [...allProperties, ...items];

        if (allProperties.length >= count) break;
        offset += limit;
      }

      return { items: allProperties, count: allProperties.length };
    } catch (error) {
      this.logger.error('Failed to fetch properties from OwnerRez', error);
      throw error;
    }
  }

  async getReservations() {
  try {
    let allReservations: any[] = [];
    let offset = 0;
    const limit = 20;
    const since_utc = '2025-10-01T00:00:00Z';

    while (true) {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/bookings`, {
          headers: this.getHeaders(),
          params: { limit, offset, since_utc },
          timeout: 30000,
        }),
      );

      const { items = [] } = response.data;
      this.logger.log(`OwnerRez bookings page offset=${offset} items=${items.length}`);

      allReservations = [...allReservations, ...items];

      if (items.length < limit) break;

      offset += limit;
    }

    this.logger.log(`OwnerRez total fetched: ${allReservations.length}`);
    return { items: allReservations, count: allReservations.length };
  } catch (error) {
    this.logger.error('Failed to fetch reservations from OwnerRez', error);
    throw error;
  }
  }
}