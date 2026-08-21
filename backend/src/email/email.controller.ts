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

  @Post('send-otp')
  async sendOtpEmail(@Body() data: { email: string; name: string; surname: string; otp: string }) {
    try {
      await this.emailService.sendOtpEmail(data.email, data.name, data.surname, data.otp);
      return { success: true, message: 'OTP email sent successfully!' };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send OTP email',
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
}