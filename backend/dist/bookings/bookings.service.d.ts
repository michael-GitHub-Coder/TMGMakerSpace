import { Repository } from 'typeorm';
import { BookingEntity } from './booking.entity';
import { CreateBookingDto, UpdateBookingDto } from './DTO/Booking.dto';
export declare class BookingsService {
    private readonly bookingRepo;
    constructor(bookingRepo: Repository<BookingEntity>);
    create(createBookingDto: CreateBookingDto): Promise<BookingEntity>;
    findAll(): Promise<BookingEntity[]>;
    findOne(id: string): Promise<BookingEntity>;
    update(id: string, dto: UpdateBookingDto): Promise<BookingEntity>;
    delete(id: string): Promise<BookingEntity>;
}
