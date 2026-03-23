import { BookingEmailService } from './bookings/booking-email.service';
import { KeyNotificationService } from './keys/key-notification.service';
export declare class EmailTestController {
    private readonly bookingEmailService;
    private readonly keyNotificationService;
    constructor(bookingEmailService: BookingEmailService, keyNotificationService: KeyNotificationService);
    testBookingEmail(testData: {
        email: string;
        name: string;
    }): Promise<{
        success: boolean;
        message: string;
        error?: undefined;
        details?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        details: any;
    }>;
    testKeyEmail(testData: {
        email: string;
        name: string;
    }): Promise<{
        success: boolean;
        message: string;
        error?: undefined;
        details?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        details: any;
    }>;
}
