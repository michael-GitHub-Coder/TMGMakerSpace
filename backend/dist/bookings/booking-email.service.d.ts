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
export declare class BookingEmailService {
    private configService;
    private readonly logger;
    transporter: nodemailer.Transporter;
    constructor(configService: ConfigService);
    sendBookingConfirmation(booking: BookingEntity): Promise<void>;
    sendBookingReminder(booking: BookingEntity): Promise<void>;
}
