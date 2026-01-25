import { EmailService } from './email.service';
import type { Booking } from '../bookings/booking.entity';
export declare class EmailController {
    private readonly emailService;
    constructor(emailService: EmailService);
    sendBookingConfirmation(data: Booking): Promise<{
        message: string;
    }>;
}
