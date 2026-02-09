import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingDto } from './DTO/Booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  // @Post()
  // create(@Body() createBookingDto: CreateBookingDto) {
  //   return this.bookingsService.create(createBookingDto);
  // }
  @Post()
  create(@Body() createBookingDto: CreateBookingDto) {
    // console.log('CreateBookingDto:', createBookingDto); 
    return this.bookingsService.create(createBookingDto);
  }

  @Get()
  findAll() {
    return this.bookingsService.findAll();
  }

    
  @Get('by-email/:email')
  findByEmail(@Param('email') email: string) {
    return this.bookingsService.findByEmail(email);
  }
  // @Get('statistics')
  // getStatistics() {
  //   return this.bookingsService.getStatistics();
  // }

  // @Get('available-slots')
  // getAvailableSlots(
  //   @Query('date') date: string,
  //   @Query('machineType') machineType: string,
  // ) {
  //   return this.bookingsService.getAvailableSlots(date, machineType);
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingsService.update(id, updateBookingDto);
  }

  // @Put(':id/cancel')
  // cancel(@Param('id') id: string) {
  //   return this.bookingsService.cancel(id);
  // }

  @Delete(':id')
  delete(@Param('id') id: string) {
    this.bookingsService.delete(id);
    return { message: 'Booking deleted successfully' };
  }


}