import { ConfigService } from '@nestjs/config';
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
export declare class BookingEmailService {
    private configService;
    private readonly logger;
    private transporter;
    constructor(configService: ConfigService);
    sendBookingConfirmation(booking: BookingEntity): Promise<void>;
    sendBookingReminder(booking: BookingEntity): Promise<void>;
}
