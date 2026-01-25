export class CreateBookingDto {
  userId: number;  // link to existing user
  machineType: string;
  pricePerHour: number;
  bookingDate: string;
  bookingTime: string;
  duration: number;
  totalPrice: number;
}

export class UpdateBookingDto {
  status?: 'pending' | 'confirmed' | 'cancelled';
  bookingDate?: string;
  bookingTime?: string;
  duration?: number;
  machineType?: string;
}
