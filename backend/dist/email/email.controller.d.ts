import { EmailService } from './email.service';
import type { Booking } from '../bookings/booking.entity';
export declare class EmailController {
    private readonly emailService;
    constructor(emailService: EmailService);
    sendBookingConfirmation(data: Booking): Promise<{
        message: string;
    }>;
    sendOtpEmail(data: {
        email: string;
        name: string;
        surname: string;
        otp: string;
    }): Promise<{
        success: boolean;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
    }>;
}
