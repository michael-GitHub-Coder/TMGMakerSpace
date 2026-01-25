import { Injectable } from '@nestjs/common';
import { Booking } from '../bookings/booking.entity';

@Injectable()
export class EmailService {
  async sendBookingConfirmation(booking: Booking): Promise<void> {
    // Ensure all required fields have values
    const emailData = {
      to: booking.email || 'customer@example.com',
      name: booking.name || 'Customer',
      surname: booking.surname || '',
      bookingDate: booking.bookingDate || 'Not specified',
      bookingTime: booking.bookingTime || 'Not specified',
      machineType: booking.machineType || 'Selected Equipment',
      duration: booking.duration || 1,
      totalPrice: booking.totalPrice || 0,
      bookingId: booking.id || 'N/A'
    };
    
    console.log('Sending booking confirmation to:', emailData.to);

    console.log('📧 Sending booking confirmation email...');
    console.log('To:', emailData.to);
    console.log('Subject: Booking Confirmation - Makerspace Equipment');
    console.log('---');
    console.log(`Dear ${emailData.name}${emailData.surname ? ' ' + emailData.surname : ''},`);
    console.log('');
    console.log('Your equipment booking has been confirmed!');
    console.log('');
    console.log('Booking Details:');
    console.log(`- Booking ID: ${emailData.bookingId}`);
    console.log(`- Machine: ${emailData.machineType}`);
    console.log(`- Date: ${emailData.bookingDate}`);
    console.log(`- Time: ${emailData.bookingTime}`);
    console.log(`- Duration: ${emailData.duration} hour(s)`);
    console.log(`- Total Price: R${emailData.totalPrice.toFixed(2)}`);
    console.log('');
    console.log('Thank you for using our Makerspace!');
    console.log('---');
  }

  async sendAdminNotification(booking: Booking): Promise<void> {
    // Log the notification to console with proper error handling
    try {
      const logData = {
        to: 'admin@makerspace.com',
        subject: 'New Booking Received',
        bookingId: booking.id || 'N/A',
        customer: `${booking.name || ''} ${booking.surname || ''}`.trim() || 'Unnamed Customer',
        email: booking.email || 'No email provided',
        phone: booking.phone || 'Not provided',
        machine: booking.machineType || 'Not specified',
        date: booking.bookingDate || 'Not specified',
        time: booking.bookingTime || 'Not specified',
        duration: `${booking.duration || 0} hour(s)`,
        totalPrice: `R${(booking.totalPrice || 0).toFixed(2)}`,
        status: booking.status || 'pending'
      };

      console.log('📧 Sending admin notification...');
      console.log('To:', logData.to);
      console.log('Subject:', logData.subject);
      console.log('---');
      console.log('A new booking has been made:');
      console.log('');
      console.log(`- Booking ID: ${logData.bookingId}`);
      console.log(`- Customer: ${logData.customer}`);
      console.log(`- Email: ${logData.email}`);
      console.log(`- Phone: ${logData.phone}`);
      console.log(`- Machine: ${logData.machine}`);
      console.log(`- Date: ${logData.date} at ${logData.time}`);
      console.log(`- Duration: ${logData.duration}`);
      console.log(`- Total: ${logData.totalPrice}`);
      console.log(`- Status: ${logData.status}`);
      console.log('---');
      
      // Log the complete booking object for debugging
      console.log('Complete booking data:', JSON.stringify(booking, null, 2));
      
    } catch (error) {
      console.error('Error in admin notification:', error);
      console.error('Booking data that caused the error:', booking);
    }
  }
}