import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeysController } from './keys.controller';
import { KeysService } from './keys.service';
import { KeyEntity } from './key.entity';

@Module({
  imports: [TypeOrmModule.forFeature([KeyEntity])],
  controllers: [KeysController],
  providers: [KeysService],
  exports: [KeysService],
})
export class KeysModule {}
