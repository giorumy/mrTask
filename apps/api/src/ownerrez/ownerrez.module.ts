import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OwnerrezService } from './ownerrez.service';
import { OwnerrezController } from './ownerrez.controller';

@Module({
  imports: [HttpModule],
  providers: [OwnerrezService],
  exports: [OwnerrezService],
  controllers: [OwnerrezController],
})
export class OwnerrezModule {}