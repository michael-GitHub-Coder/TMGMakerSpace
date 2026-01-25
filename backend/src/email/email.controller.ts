import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';
import type { Booking } from '../bookings/booking.entity';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('booking-confirmation')
  async sendBookingConfirmation(@Body() data: Booking) {
    await this.emailService.sendBookingConfirmation(data);
    await this.emailService.sendAdminNotification(data);
    return { message: 'Emails sent successfully' };
  }
}