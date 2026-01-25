import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingDto } from './booking.entity';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    create(createBookingDto: CreateBookingDto): Promise<import("./booking.entity").Booking>;
    findAll(): import("./booking.entity").Booking[];
    getStatistics(): {
        total: number;
        confirmed: number;
        pending: number;
        cancelled: number;
        totalRevenue: number;
    };
    getAvailableSlots(date: string, machineType: string): string[];
    findOne(id: string): import("./booking.entity").Booking;
    update(id: string, updateBookingDto: UpdateBookingDto): import("./booking.entity").Booking;
    cancel(id: string): import("./booking.entity").Booking;
    delete(id: string): {
        message: string;
    };
}
