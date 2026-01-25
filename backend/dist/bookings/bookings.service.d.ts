import { EmailService } from '../email/email.service';
import { Booking, CreateBookingDto, UpdateBookingDto } from './booking.entity';
export declare class BookingsService {
    private readonly emailService;
    private bookings;
    private idCounter;
    constructor(emailService: EmailService);
    private toDateTime;
    private hasConflict;
    create(createBookingDto: CreateBookingDto): Promise<Booking>;
    findAll(): Booking[];
    findOne(id: string): Booking;
    update(id: string, updateBookingDto: UpdateBookingDto): Booking;
    cancel(id: string): Booking;
    delete(id: string): void;
    getAvailableSlots(date: string, machineType: string): string[];
    private generateTimeSlots;
    getStatistics(): {
        total: number;
        confirmed: number;
        pending: number;
        cancelled: number;
        totalRevenue: number;
    };
}
