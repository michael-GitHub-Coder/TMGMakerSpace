import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { MarketplaceSimpleController } from './marketplace-simple.controller.js';
import { MarketplaceService } from './marketplace.service.js';
import { MarketplaceItem } from './entities/marketplace-item.entity.js';
import { EmailMarketplaceService } from '../email/email-marketplace.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([MarketplaceItem]),
    MulterModule.register({
      dest: './uploads/marketplace',
    })
  ],
  controllers: [MarketplaceSimpleController],
  providers: [MarketplaceService, EmailMarketplaceService],
  exports: [MarketplaceService]
})
export class MarketplaceModule {}
