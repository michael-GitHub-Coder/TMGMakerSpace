import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { BookingEntity } from './booking.entity';
import { BookingEmailService } from './booking-email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookingEntity]), 
  ],
  providers: [BookingsService, BookingEmailService],
  controllers: [BookingsController],
})
export class BookingsModule {}
