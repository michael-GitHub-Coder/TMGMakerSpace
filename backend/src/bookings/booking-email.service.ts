import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { BookingEntity } from './booking.entity';

export interface BookingConfirmationData {
  name: string;
  surname: string;
  email: string;
  phone: string;
  machineType: string;
  bookingDate: string;
  bookingTime: string;
  duration: number;
  totalPrice: number;
  bookingId: string;
}

@Injectable()
export class BookingEmailService {
  private readonly logger = new Logger(BookingEmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST') || 'smtp.gmail.com',
      port: parseInt(this.configService.get<string>('EMAIL_PORT') || '465'),
      secure: true, // Use SSL for port 465
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  async sendBookingConfirmation(booking: BookingEntity): Promise<void> {
    const subject = `Booking Confirmation: ${booking.machineType} - TMG Makerspace`;
    
    const emailContent = `
      Dear ${booking.name} ${booking.surname},
      
      ✅ Your equipment booking has been confirmed at TMG Makerspace!
      
      📋 Booking Details:
      • Booking ID: ${booking.id}
      • Equipment: ${booking.machineType}
      • Date: ${booking.bookingDate}
      • Time: ${booking.bookingTime}
      • Duration: ${booking.duration} hour(s)
      • Total Price: R${booking.totalPrice.toFixed(2)}
      
      📍 Important Information:
      • Please arrive 10 minutes before your booking time
      • Bring your ID for verification
      • Equipment will be available for pickup at admin desk
      
      ⚠️ Cancellation Policy:
      • Cancellations must be made at least 2 hours before booking time
      • No-shows may be charged the full booking fee
      • Contact admin for any changes
      
      📞 Questions? Contact TMG Makerspace staff
      
      We look forward to seeing you at TMG Makerspace!
      
      Best regards,
      TMG Makerspace Team
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || '"TMG Makerspace" <noreply@tmgmakerspace.com>',
        to: booking.email,
        subject: subject,
        html: emailContent.replace(/\n/g, '<br>'),
      });
      
      this.logger.log(`[BOOKING EMAIL] Confirmation sent to ${booking.email} for ${booking.machineType}`);
    } catch (error) {
      this.logger.error(`[BOOKING EMAIL] Failed to send booking confirmation:`, error);
      throw new Error(`Failed to send booking confirmation email: ${error.message}`);
    }
  }

  async sendBookingReminder(booking: BookingEntity): Promise<void> {
    const subject = `Reminder: Upcoming Booking - ${booking.machineType} - TMG Makerspace`;
    
    const emailContent = `
      Dear ${booking.name} ${booking.surname},
      
      ⏰ REMINDER: You have an upcoming booking at TMG Makerspace.
      
      📋 Booking Details:
      • Booking ID: ${booking.id}
      • Equipment: ${booking.machineType}
      • Date: ${booking.bookingDate}
      • Time: ${booking.bookingTime}
      • Duration: ${booking.duration} hour(s)
      
      📍 Reminder:
      • Your booking is coming up soon
      • Please arrive 10 minutes early
      • Bring your ID for verification
      
      📞 Questions? Contact TMG Makerspace staff
      
      See you soon at TMG Makerspace!
      
      Best regards,
      TMG Makerspace Team
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || '"TMG Makerspace" <noreply@tmgmakerspace.com>',
        to: booking.email,
        subject: subject,
        html: emailContent.replace(/\n/g, '<br>'),
      });
      
      this.logger.log(`[BOOKING EMAIL] Reminder sent to ${booking.email} for ${booking.machineType}`);
    } catch (error) {
      this.logger.error(`[BOOKING EMAIL] Failed to send booking reminder:`, error);
      throw new Error(`Failed to send booking reminder email: ${error.message}`);
    }
  }
}
