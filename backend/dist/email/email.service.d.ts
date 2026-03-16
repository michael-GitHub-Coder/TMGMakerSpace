import { Booking } from '../bookings/booking.entity';
export declare class EmailService {
    sendBookingConfirmation(booking: Booking): Promise<void>;
    sendAdminNotification(booking: Booking): Promise<void>;
}
