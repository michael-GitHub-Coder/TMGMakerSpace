import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingDto } from './DTO/Booking.dto';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    create(createBookingDto: CreateBookingDto): Promise<import("./booking.entity").BookingEntity>;
    findAll(): Promise<import("./booking.entity").BookingEntity[]>;
    findByEmail(email: string): Promise<import("./booking.entity").BookingEntity[]>;
    findOne(id: string): Promise<import("./booking.entity").BookingEntity>;
    update(id: string, updateBookingDto: UpdateBookingDto): Promise<import("./booking.entity").BookingEntity>;
    delete(id: string): {
        message: string;
    };
}
