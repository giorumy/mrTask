import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { SyncController } from './sync.controller';
import { OwnerrezModule } from '../ownerrez/ownerrez.module';

@Module({
  imports: [OwnerrezModule],
  providers: [SyncService],
  controllers: [SyncController],
})
export class SyncModule {}