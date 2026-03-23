import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeysController } from './keys.controller';
import { KeysService } from './keys.service';
import { KeyNotificationService } from './key-notification.service';
import { KeyEntity } from './key.entity';

@Module({
  imports: [TypeOrmModule.forFeature([KeyEntity])],
  controllers: [KeysController],
  providers: [KeysService, KeyNotificationService],
  exports: [KeysService],
})
export class KeysModule {}
