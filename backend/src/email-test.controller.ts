import { Controller, Post, Body } from '@nestjs/common';
import { BookingEmailService } from './bookings/booking-email.service';
import { KeyNotificationService } from './keys/key-notification.service';
import { BookingEntity } from './bookings/booking.entity';

@Controller('email-test')
export class EmailTestController {
  constructor(
    private readonly bookingEmailService: BookingEmailService,
    private readonly keyNotificationService: KeyNotificationService,
  ) {}

  @Post('test-booking-email')
  async testBookingEmail(@Body() testData: { email: string; name: string }) {
    try {
      // Create a mock booking object with correct types
      const mockBooking: BookingEntity = {
        id: 'TEST123',
        name: testData.name,
        surname: 'TestUser',
        email: testData.email,
        phone: '0000000000',
        machineType: 'Laser Cutter',
        pricePerHour: 200,
        bookingDate: '2026-03-25',
        bookingTime: '14:00',
        duration: 2,
        totalPrice: 400,
        status: 'confirmed' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await this.bookingEmailService.sendBookingConfirmation(mockBooking);
      return { success: true, message: 'Booking email sent successfully!' };
    } catch (error) {
      return { 
        success: false, 
        message: 'Failed to send booking email', 
        error: error.message,
        details: error 
      };
    }
  }

  @Post('test-key-email')
  async testKeyEmail(@Body() testData: { email: string; name: string }) {
    try {
      const mockKeyData = {
        memberName: testData.name,
        memberEmail: testData.email,
        memberPhone: '0000000000',
        equipmentName: 'Laser Cutter',
        issuedBy: 'Test Admin',
        issuedDateTime: '2026-03-25 14:00',
      };

      await this.keyNotificationService.sendKeyIssuedNotification(mockKeyData);
      return { success: true, message: 'Key email sent successfully!' };
    } catch (error) {
      return { 
        success: false, 
        message: 'Failed to send key email', 
        error: error.message,
        details: error 
      };
    }
  }
}
