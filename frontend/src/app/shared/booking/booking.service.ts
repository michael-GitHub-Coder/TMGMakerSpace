import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Booking {
  id: string;
  // role: string;
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
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService implements OnDestroy {
  private apiUrl = 'http://localhost:3000/bookings';
  private bookingsSubject = new BehaviorSubject<Booking[]>([]);
  public bookings$ = this.bookingsSubject.asObservable();
  private refreshInterval: any;

  constructor(private http: HttpClient) {
    this.loadBookings();
    // Refresh bookings every 30 seconds to ensure data is up-to-date
    this.refreshInterval = setInterval(() => this.loadBookings(), 30000);
  }

  findByEmail(email: string) {
    return this.http.get<Booking[]>(
      `${this.apiUrl}/by-email/${email}`
    );
  }
  
  ngOnDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  private async loadBookings(): Promise<void> {
    try {
      console.log('Fetching bookings from:', this.apiUrl);
      const response = await firstValueFrom(
        this.http.get<Array<Omit<Booking, 'status'> & { status: string }>>(this.apiUrl)
      );
      
      console.log('Raw API response:', response);
      
      if (!Array.isArray(response)) {
        console.error('Expected an array of bookings but got:', response);
        throw new Error('Invalid response format: Expected an array of bookings');
      }
      
      // Map and normalize booking data
      const typedBookings = response.map(booking => {
        console.log('Processing booking:', booking);
        
        // Normalize booking data with fallback values
        return {
          id: booking.id || '',
          // role: booking.role || 'user',
          name: booking.name || '',
          surname: booking.surname || '',
          email: booking.email || '',
          phone: booking.phone || '',
          machineType: booking.machineType || 'Unknown',
          pricePerHour: booking.pricePerHour || 0,
          bookingDate: booking.bookingDate || '',
          bookingTime: booking.bookingTime || '',
          duration: booking.duration || 0,
          totalPrice: booking.totalPrice || 0,
          status: (booking.status && ['pending', 'confirmed', 'cancelled'].includes(booking.status.toLowerCase())
            ? booking.status.toLowerCase() 
            : 'pending') as 'pending' | 'confirmed' | 'cancelled',
          createdAt: booking.createdAt || new Date().toISOString()
        };
      });
      
      // Sort bookings by date and time (newest first)
      const sortedBookings = typedBookings.sort((a, b) => {
        try {
          const dateA = a.bookingDate && a.bookingTime ? new Date(`${a.bookingDate}T${a.bookingTime}`).getTime() : 0;
          const dateB = b.bookingDate && b.bookingTime ? new Date(`${b.bookingDate}T${b.bookingTime}`).getTime() : 0;
          return dateB - dateA;
        } catch (e) {
          console.error('Error sorting bookings:', e);
          return 0;
        }
      });
      
      console.log('Processed and sorted bookings 1:', sortedBookings);
      this.bookingsSubject.next(sortedBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
      // Don't clear existing data on error, just log it
      if (this.bookingsSubject.value.length === 0) {
        this.bookingsSubject.next([]);
      }
    }
  }

  getAllBookings(): Booking[] {
    return this.bookingsSubject.value;
  }

  async getBookingById(id: string): Promise<Booking> {
    return firstValueFrom(this.http.get<Booking>(`${this.apiUrl}/${id}`));
  }

  async isTimeSlotAvailable(machineType: string, date: string, time: string): Promise<boolean> {
    try {
      const availableSlots = await firstValueFrom(
        this.http.get<string[]>(`${this.apiUrl}/available-slots`, {
          params: { date, machineType }
        })
      );
      return availableSlots.includes(time);
    } catch (error) {
      console.error('Error checking time slot availability:', error);
      return false;
    }
  }

  async createBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>): Promise<Booking> {
    try {
      console.log('Raw booking data received:', bookingData);
      
      // Create a clean booking object with all required fields
      const booking = {
        // role: bookingData.role || 'Makerspace User',
        name: (bookingData.name || '').trim(),
        surname: (bookingData.surname || '').trim(),
        email: (bookingData.email || '').trim().toLowerCase(),
        phone: (bookingData.phone || '').trim(),
        machineType: bookingData.machineType || '',
        pricePerHour: Number(bookingData.pricePerHour) || 0,
        bookingDate: bookingData.bookingDate,
        bookingTime: bookingData.bookingTime,
        duration: Math.max(1, Number(bookingData.duration) || 1),
        totalPrice: Number(bookingData.totalPrice) || 0
      };

      // Calculate total price if not provided
      if (!booking.totalPrice || isNaN(booking.totalPrice)) {
        booking.totalPrice = booking.pricePerHour * booking.duration;
      }

      console.log('Processed booking data being sent to server:', JSON.stringify(booking, null, 2));
      
      // First check if the slot is still available
      // const isAvailable = await this.isTimeSlotAvailable(
      //   booking.machineType, 
      //   booking.bookingDate, 
      //   booking.bookingTime
      // );

      // if (!isAvailable) {
      //   throw new Error('This time slot is no longer available. Please select a different time.');
      // }

      const newBooking = await firstValueFrom(
        this.http.post<Booking>(this.apiUrl, booking).pipe(
          tap((createdBooking) => {
            console.log('Server response - created booking:', JSON.stringify(createdBooking, null, 2));
            this.loadBookings();
          })
        )
      );
      
      if (!newBooking) {
        throw new Error('No booking data returned from server');
      }
      return newBooking;
      
    } catch (error: any) {
      console.error('Error creating booking:', error);
      
      if (error.status === 409) {
        throw new Error('This time slot is already booked. Please select a different time.');
      } else if (error.error?.message) {
        // Handle server-side validation errors
        throw new Error(error.error.message);
      } else if (error.message) {
        // Re-throw our custom messages
        throw error;
      } else {
        throw new Error('Failed to create booking. Please try again.');
      }
    }
  }

  async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking> {
    const updatedBooking = await firstValueFrom(
      this.http.put<Booking>(`${this.apiUrl}/${id}`, updates).pipe(
        tap(() => this.loadBookings())
      )
    );
    return updatedBooking;
  }

  async cancelBooking(id: string): Promise<void> {
    try {
      await firstValueFrom(
        this.http.patch<Booking>(`${this.apiUrl}/${id}`, { status: 'cancelled' as const })
      );
      // Update the local state
      const currentBookings = this.bookingsSubject.value;
      const updatedBookings = currentBookings.map(booking => 
        booking.id === id ? { ...booking, status: 'cancelled' as const } : booking
      );
      this.bookingsSubject.next(updatedBookings);
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  }

  async deleteBooking(id: string): Promise<void> {
    await firstValueFrom(
      this.http.delete(`${this.apiUrl}/${id}`).pipe(
        tap(() => this.loadBookings())
      )
    );
  }

  getBookingsByDate(date: string): Booking[] {
    return this.bookingsSubject.value.filter(b => b.bookingDate === date);
  }

  getBookingsByMachine(machineType: string): Booking[] {
    return this.bookingsSubject.value.filter(b => b.machineType === machineType);
  }

  async getStatistics(): Promise<any> {
    return firstValueFrom(this.http.get(`${this.apiUrl}/statistics`));
  }
}