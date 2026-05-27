import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OwnerrezModule } from './ownerrez/ownerrez.module';
import { PrismaModule } from './prisma/prisma.module';
import { SyncModule } from './sync/sync.module';
import { PropertiesModule } from './properties/properties.module';
import { StaffModule } from './staff/staff.module';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { TaskTemplatesModule } from './task-templates/task-templates.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    PrismaModule,
    OwnerrezModule,
    SyncModule,
    PropertiesModule,
    StaffModule,
    TasksModule,
    AuthModule,
    TaskTemplatesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}