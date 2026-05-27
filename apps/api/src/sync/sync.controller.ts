import { Controller, Post } from '@nestjs/common';
import { SyncService } from './sync.service';

@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post('properties')
  syncProperties() {
    return this.syncService.syncProperties();
  }

  @Post('reservations')
  syncReservations() {
    return this.syncService.syncReservations();
  }
}