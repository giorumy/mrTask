import { Controller, Get } from '@nestjs/common';
import { OwnerrezService } from './ownerrez.service';

@Controller('ownerrez')
export class OwnerrezController {
  constructor(private readonly ownerrezService: OwnerrezService) {}

  @Get('properties')
  getProperties() {
    return this.ownerrezService.getProperties();
  }

  @Get('reservations')
  getReservations() {
    return this.ownerrezService.getReservations();
  }
}