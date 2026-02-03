import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { BookingEntity } from './booking.entity';
import { CreateBookingDto,UpdateBookingDto } from './DTO/Booking.dto';


@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(BookingEntity)
    private readonly bookingRepo: Repository<BookingEntity>
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<BookingEntity> {
    const startTime = new Date(`${createBookingDto.bookingDate}T${createBookingDto.bookingTime}`);
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + createBookingDto.duration);

    const conflict = await this.bookingRepo
      .createQueryBuilder('booking')
      .where('booking.machineType = :machineType', { machineType: createBookingDto.machineType })
      .andWhere('booking.status != :cancelled', { cancelled: 'cancelled' })
      .andWhere('booking.bookingDate = :bookingDate', { bookingDate: createBookingDto.bookingDate })
      .andWhere(
        `(
          (booking.bookingTime <= :newStartTime AND DATEADD(hour, booking.duration, booking.bookingTime) > :newStartTime)
          OR
          (booking.bookingTime < :newEndTime AND DATEADD(hour, booking.duration, booking.bookingTime) >= :newEndTime)
          OR
          (booking.bookingTime >= :newStartTime AND DATEADD(hour, booking.duration, booking.bookingTime) <= :newEndTime)
        )`,
        { newStartTime: createBookingDto.bookingTime, newEndTime: endTime.toTimeString().slice(0,5) }
      )
      .getOne();

    if (conflict) {
      throw new ConflictException('This slot overlaps with an existing booking.');
    }

    const newBooking = this.bookingRepo.create({
      ...createBookingDto,
      id: `BK${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      status: 'pending'
    });

    return this.bookingRepo.save(newBooking);
  }

  // async create(createBookingDto: CreateBookingDto): Promise<BookingEntity> {
  //   // Check conflicts
  //   console.log('CreateBookingDto:', createBookingDto);

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

  // findOne(id: string): Promise<BookingEntity> {
  //   return this.bookingRepo.findOne({ where: { id } });
  // }
  async findOne(id: string): Promise<BookingEntity> {
    const booking = await this.bookingRepo.findOne({ where: { id } });

    if (!booking) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }

    return booking;
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
  