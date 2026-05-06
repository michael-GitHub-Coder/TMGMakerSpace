import { Booking } from '../bookings/booking.entity';
export declare class EmailService {
    sendBookingConfirmation(booking: Booking): Promise<void>;
    sendAdminNotification(booking: Booking): Promise<void>;
    sendOtpEmail(email: string, name: string, surname: string, otp: string): Promise<void>;
}
