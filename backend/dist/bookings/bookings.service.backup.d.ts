import { Repository } from 'typeorm';
import { BookingEntity } from './booking.entity';
import { CreateBookingDto, UpdateBookingDto } from './DTO/Booking.dto';
import { BookingEmailService } from './booking-email.service';
export declare class BookingsService {
    private readonly bookingRepo;
    private readonly bookingEmailService;
    private readonly logger;
    constructor(bookingRepo: Repository<BookingEntity>, bookingEmailService: BookingEmailService);
    create(createBookingDto: CreateBookingDto): Promise<BookingEntity>;
    findAll(): Promise<BookingEntity[]>;
    findOne(id: string): Promise<BookingEntity>;
    update(id: string, updateBookingDto: UpdateBookingDto): Promise<BookingEntity>;
    remove(id: string): Promise<void>;
    findByEmail(email: string): Promise<BookingEntity[]>;
    delete(id: string): Promise<void>;
}
