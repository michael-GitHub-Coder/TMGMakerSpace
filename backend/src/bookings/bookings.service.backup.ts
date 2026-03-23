import { Injectable, ConflictException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { BookingEntity } from './booking.entity';
import { CreateBookingDto,UpdateBookingDto } from './DTO/Booking.dto';
import { BookingEmailService } from './booking-email.service';


@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);
  
  constructor(
    @InjectRepository(BookingEntity)
    private readonly bookingRepo: Repository<BookingEntity>,
    private readonly bookingEmailService: BookingEmailService
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<BookingEntity> {
    this.logger.log(`[BOOKING] Creating booking for ${createBookingDto.email}`);
    this.logger.log(`[BOOKING] Booking data:`, createBookingDto);

    // Simple conflict check - just check exact time slot for now
    const conflict = await this.bookingRepo.findOne({
      where: {
        machineType: createBookingDto.machineType,
        bookingDate: createBookingDto.bookingDate,
        bookingTime: createBookingDto.bookingTime,
        status: Not('cancelled')
      }
    });

    if (conflict) {
      this.logger.warn(`[BOOKING] Conflict detected for slot ${createBookingDto.bookingDate} ${createBookingDto.bookingTime}`);
      throw new ConflictException('This slot is already booked.');
    }

    const newBooking = this.bookingRepo.create({
      ...createBookingDto,
      id: `BK${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      status: 'pending'
    });

    try {
      const savedBooking = await this.bookingRepo.save(newBooking);
      this.logger.log(`[BOOKING] Booking saved successfully: ${savedBooking.id}`);
      
      // Send booking confirmation email
      if (this.bookingEmailService) {
        try {
          await this.bookingEmailService.sendBookingConfirmation(savedBooking);
          this.logger.log(`[BOOKING] Confirmation email sent for booking ${savedBooking.id}`);
        } catch (emailError) {
          this.logger.error(`[BOOKING] Failed to send confirmation email:`, emailError);
          // Don't fail the booking if email fails
        }
      } else {
        this.logger.warn(`[BOOKING] BookingEmailService not available - skipping email`);
      }

      return savedBooking;
    } catch (saveError) {
      this.logger.error(`[BOOKING] Failed to save booking:`, saveError);
      throw saveError;
    }
  }
  //   const conflict = await this.bookingRepo.findOne({
  //     where: {
  //       bookingDate: createBookingDto.bookingDate,
  //       bookingTime: createBookingDto.bookingTime,
  //       machineType: createBookingDto.machineType,
  //       status: Not('cancelled')
  //     }
  //   });

  //   if (conflict) {
  //     throw new ConflictException('This slot is already booked.');
  //   }

  //   const newBooking = this.bookingRepo.create({
  //     ...createBookingDto,
  //     id: `BK${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
  //     status: 'pending'
  //   });

  //   return this.bookingRepo.save(newBooking);
  // }

  findAll(): Promise<BookingEntity[]> {
    return this.bookingRepo.find({ order: { bookingDate: 'DESC', bookingTime: 'DESC' } });
  }

  async findOne(id: string): Promise<BookingEntity> {
    const booking = await this.bookingRepo.findOne({ where: { id } });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking;
  }

  async update(id: string, updateBookingDto: UpdateBookingDto): Promise<BookingEntity> {
    const booking = await this.findOne(id);
    Object.assign(booking, updateBookingDto);
    return this.bookingRepo.save(booking);
  }

  async remove(id: string): Promise<void> {
    const booking = await this.findOne(id);
    await this.bookingRepo.remove(booking);
  }

  async findByEmail(email: string): Promise<BookingEntity[]> {
    return this.bookingRepo.find({ 
      where: { email },
      order: { bookingDate: 'DESC', bookingTime: 'DESC' }
    });
  }

  async delete(id: string): Promise<void> {
    await this.remove(id);
  }
}
