import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OwnerrezModule } from './ownerrez/ownerrez.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    OwnerrezModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}