import { Injectable, Logger } from '@nestjs/common';
import {Cron, CronExpression} from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { OwnerrezService } from '../ownerrez/ownerrez.service';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly ownerrez: OwnerrezService,
  ) {}

  @Cron(CronExpression.EVERY_6_HOURS)
  async scheduledSync() {
    this.logger.log('Running scheduled OwnerRez sync...');
    await this.syncProperties();
    await this.syncReservations();
  }

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

    const now = new Date();

    // filter first, no DB calls yet
    const filtered = items.filter(
        (b) => !b.is_block && new Date(b.arrival) >= now,
    );

    // fetch all properties once
    const properties = await this.prisma.property.findMany({
        select: { id: true, ownerRezId: true },
    });
    const propertyMap = new Map(properties.map((p) => [p.ownerRezId, p.id]));

    // batch upserts
    const upserts = filtered
        .filter((b) => propertyMap.has(String(b.property_id)))
        .map((booking) =>
        this.prisma.reservation.upsert({
            where: { ownerRezId: String(booking.id) },
            update: {
            guestArrival: new Date(booking.arrival),
            guestDeparture: new Date(booking.departure),
            },
            create: {
            ownerRezId: String(booking.id),
            propertyId: propertyMap.get(String(booking.property_id))!,
            guestArrival: new Date(booking.arrival),
            guestDeparture: new Date(booking.departure),
            },
        }),
        );

    await this.prisma.$transaction(upserts);

    this.logger.log(`Synced ${upserts.length} reservations.`);
    return { synced: upserts.length };
  }
}