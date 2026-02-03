import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { BookingEntity } from './booking.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookingEntity]), 
  ],
  providers: [BookingsService],
  controllers: [BookingsController],
})
export class BookingsModule {}
