import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Booking } from '../booking/booking.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = 'http://localhost:3000/email';

  constructor(private http: HttpClient) {}

  async sendBookingConfirmation(booking: Booking): Promise<boolean> {
    try {
      // Ensure all required fields have values
      const emailData = {
        to: booking.email || '',
        name: booking.name || 'Valued Customer',
        surname: booking.surname || '',
        bookingDate: booking.bookingDate || 'Not specified',
        bookingTime: booking.bookingTime || 'Not specified',
        machineType: booking.machineType || 'Selected Equipment',
        duration: booking.duration || 1,
        totalPrice: booking.totalPrice || 0,
        bookingId: booking.id || 'BK0000'
      };

      console.log('📤 Sending booking confirmation with data:', JSON.stringify(emailData, null, 2));

      const response = await firstValueFrom(
        this.http.post(`${this.apiUrl}/booking-confirmation`, emailData)
      );

      console.log('✅ Booking confirmation email sent to:', emailData.to);
      return true;
    } catch (error) {
      console.error('❌ Error sending booking confirmation email:', error);
      // Don't fail the booking if email fails
      return true;
    }
  }

  async sendAdminNotification(booking: Booking): Promise<boolean> {
    try {
      // Ensure all required fields have values
      const emailData = {
        to: 'admin@makerspace.com',
        name: booking.name || 'Customer',
        surname: booking.surname || '',
        bookingDate: booking.bookingDate || 'Not specified',
        bookingTime: booking.bookingTime || 'Not specified',
        machineType: booking.machineType || 'Unknown Equipment',
        duration: booking.duration || 1,
        totalPrice: booking.totalPrice || 0,
        bookingId: booking.id || 'BK0000',
        email: booking.email || 'No email provided'
      };

      console.log('📤 Sending admin notification with data:', JSON.stringify(emailData, null, 2));

      // In a real implementation, you would send this to an admin endpoint
      // For now, we'll just log it
      console.log('✅ Admin notification prepared for booking:', booking.id);
      return true;
    } catch (error) {
      console.error('❌ Error preparing admin notification:', error);
      // Don't fail the booking if admin notification fails
      return true;
    }
  }
}