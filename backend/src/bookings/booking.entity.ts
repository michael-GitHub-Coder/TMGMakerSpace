export interface Booking {
  id: string;

  // User details
  role: string;
  name: string;
  surname: string;
  email: string;
  phone: string;

  // Machine & pricing
  machineType: string;
  pricePerHour: number;

  // Booking timing
  bookingDate: string;  // format: YYYY-MM-DD
  bookingTime: string;  // format: HH:mm
  duration: number;     // duration in hours
  totalPrice: number;   // pricePerHour * duration

  // Status
  status: 'pending' | 'confirmed' | 'cancelled';

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO used to CREATE a booking.
 * All fields required except ID and timestamps.
 */
export class CreateBookingDto {
  role: string;
  name: string;
  surname: string;
  email: string;
  phone: string;

  machineType: string;
  pricePerHour: number;

  bookingDate: string;
  bookingTime: string;
  duration: number;

  totalPrice: number;
}

/**
 * DTO used to UPDATE a booking.
 * Only optional fields here.
 */
export class UpdateBookingDto {
  status?: 'pending' | 'confirmed' | 'cancelled';

  // Optional updated schedule
  bookingDate?: string;
  bookingTime?: string;
  duration?: number;

  // Optional machine change
  machineType?: string;
}
