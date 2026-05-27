import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OwnerrezService } from '../ownerrez/ownerrez.service';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly ownerrez: OwnerrezService,
  ) {}

  async syncProperties() {
    this.logger.log('Syncing properties from OwnerRez...');
    const { items } = await this.ownerrez.getProperties();

    for (const property of items) {
      const address = property.address
        ? `${property.address.street1}${property.address.street2 ? ' ' + property.address.street2 : ''}, ${property.address.city}, ${property.address.state} ${property.address.postal_code}`
        : '';

      await this.prisma.property.upsert({
        where: { ownerRezId: String(property.id) },
        update: {
          name: property.name,
          address,
          coverImageUrl: property.thumbnail_url_large ?? property.thumbnail_url ?? null,
        },
        create: {
          ownerRezId: String(property.id),
          name: property.name,
          address,
          coverImageUrl: property.thumbnail_url_large ?? property.thumbnail_url ?? null,
        },
      });
    }

    this.logger.log(`Synced ${items.length} properties.`);
    return { synced: items.length };
  }

  async syncReservations() {
    this.logger.log('Syncing reservations from OwnerRez...');
    const { items } = await this.ownerrez.getReservations();
    let synced = 0;

    const now = new Date();

    for (const booking of items) {
      const arrival = new Date(booking.arrival);

      if (arrival < now) continue;

      const property = await this.prisma.property.findUnique({
        where: { ownerRezId: String(booking.property_id) },
      });

      if (!property) continue;

      await this.prisma.reservation.upsert({
        where: { ownerRezId: String(booking.id) },
        update: {
          guestArrival: new Date(booking.arrival),
          guestDeparture: new Date(booking.departure),
        },
        create: {
          ownerRezId: String(booking.id),
          propertyId: property.id,
          guestArrival: new Date(booking.arrival),
          guestDeparture: new Date(booking.departure),
        },
      });
      synced++;
    }

    this.logger.log(`Synced ${synced} reservations.`);
    return { synced };
  }
}