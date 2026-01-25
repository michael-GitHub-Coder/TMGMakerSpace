import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { BookingEntity } from './booking.entity';
import { CreateBookingDto, UpdateBookingDto } from './booking.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(BookingEntity)
    private readonly bookingRepo: Repository<BookingEntity>
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<BookingEntity> {
    // Check conflicts
    const conflict = await this.bookingRepo.findOne({
      where: {
        bookingDate: createBookingDto.bookingDate,
        bookingTime: createBookingDto.bookingTime,
        machineType: createBookingDto.machineType,
        status: Not('cancelled')
      }
    });

    if (conflict) {
      throw new ConflictException('This slot is already booked.');
    }

    const newBooking = this.bookingRepo.create({
      ...createBookingDto,
      id: `BK${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      status: 'pending'
    });

    return this.bookingRepo.save(newBooking);
  }

  findAll(): Promise<BookingEntity[]> {
    return this.bookingRepo.find({ order: { bookingDate: 'DESC', bookingTime: 'DESC' } });
  }

  findOne(id: string): Promise<BookingEntity> {
    return this.bookingRepo.findOne({ where: { id } });
  }

  async update(id: string, dto: UpdateBookingDto): Promise<BookingEntity> {
    const booking = await this.findOne(id);
    if (!booking) throw new NotFoundException();

    Object.assign(booking, dto);
    return this.bookingRepo.save(booking);
  }

  async delete(id: string) {
    const booking = await this.findOne(id);
    if (!booking) throw new NotFoundException();
    return this.bookingRepo.remove(booking);
  }
}
