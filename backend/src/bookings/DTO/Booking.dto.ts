import { IsString, IsEmail, IsNumber, IsDateString } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  machineType: string;

  @IsNumber()
  pricePerHour: number;

  @IsDateString()
  bookingDate: string;

  @IsString()
  bookingTime: string;

  @IsNumber()
  duration: number;

  @IsNumber()
  totalPrice: number;
}


export class UpdateBookingDto {
  status?: 'pending' | 'confirmed' | 'cancelled';
  bookingDate?: string;
  bookingTime?: string;
  duration?: number;
  machineType?: string;
}
