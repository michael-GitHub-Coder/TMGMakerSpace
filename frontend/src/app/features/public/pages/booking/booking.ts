import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../../../shared/header/header';
import { FooterComponent } from '../../../../shared/footer/footer';
import { BannerComponent } from '../../../../shared/banner/banner';
import { BookingService, Booking } from '../../../../shared/booking/booking.service';
import { EmailService } from '../../../../shared/email/email.service';
import { AuthService } from '../../../../shared/services/auth.service';
interface MachineType {
  name: string;
  pricePerHour: number;
}

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, FooterComponent, BannerComponent],
  templateUrl: './booking.html',
  styleUrls: ['./booking.css']
})
export class BookingComponent implements OnInit {
  bookingForm!: FormGroup;
  showSuccess = false;
  showError = false;
  errorMessage = '';
  isSubmitting = false;
  bookedSlots: { date: string; time: string; machine: string }[] = [];

  roles = ['Admin', 'Makerspace User', 'Developer', 'Student', 'Educator', 'Entrepreneur', 'Other'];
  
  machineTypes: MachineType[] = [
    { name: '3D Printer', pricePerHour: 150 },
    { name: 'Laser Cutter', pricePerHour: 200 },
    { name: 'Welder', pricePerHour: 180 },
    { name: 'Molder', pricePerHour: 170 },
    { name: 'CNC Machine', pricePerHour: 250 },
    { name: 'Vinyl Cutter', pricePerHour: 120 },
    { name: 'Soldering Station', pricePerHour: 100 }
  ];

  timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  durations = [1, 2, 3, 4, 5, 6, 7, 8];

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private emailService: EmailService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    // this.loadBookedSlots();

    const currentUser = this.authService.getCurrentUser(); 
    if (currentUser) {
      // patch form values for personal info
      this.bookingForm.patchValue({
        name: currentUser.firstName,
        surname: currentUser.lastName,
        email: currentUser.email,
        phone: currentUser.phone
      });
    }
  }


  initializeForm(): void {
    const currentUser = this.authService.getCurrentUser();

    this.bookingForm = this.fb.group({
      role: [currentUser?.role || 'Member'],
      name: [currentUser?.firstName || ''],
      surname: [currentUser?.lastName || ''],
      email: [currentUser?.email || ''],
      phone: [currentUser?.phone || ''],
      machineType: ['', Validators.required],
      bookingDate: ['', [Validators.required, this.futureDateValidator()]],
      bookingTime: ['', Validators.required],
      duration: [1, [
        Validators.required,
        Validators.min(1),
        Validators.max(8),
        Validators.pattern('^[0-9]*$')
      ]]
    });

    // Update price when machine type or duration changes
    this.bookingForm.get('machineType')?.valueChanges.subscribe(() => this.updatePrice());
    this.bookingForm.get('duration')?.valueChanges.subscribe(() => this.updatePrice());
}


  private futureDateValidator() {
    return (control: { value: string | number | Date; }) => {
      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time part for accurate date comparison
      
      if (selectedDate < today) {
        return { pastDate: true };
      }
      return null;
    };
  }

  loadBookedSlots(): void {
    const bookings = this.bookingService.getAllBookings();
    this.bookedSlots = bookings
      .filter(b => b.status !== 'cancelled')
      .map(b => ({
        date: b.bookingDate,
        time: b.bookingTime,
        machine: b.machineType
      }));
  }

  isTimeSlotDisabled(time: string): boolean {
    const selectedDate = this.bookingForm.get('bookingDate')?.value;
    const selectedMachine = this.bookingForm.get('machineType')?.value;
    
    if (!selectedDate || !selectedMachine) {
      return false;
    }

    return this.bookedSlots.some(
      slot => slot.date === selectedDate && 
              slot.time === time && 
              slot.machine === selectedMachine
    );
  }

  getSelectedMachinePrice(): number {
    const selectedMachine = this.bookingForm.get('machineType')?.value;
    const machine = this.machineTypes.find(m => m.name === selectedMachine);
    return machine ? machine.pricePerHour : 0;
  }

  getTotalPrice(): number {
    const duration = Number(this.bookingForm.get('duration')?.value) || 1;
    const pricePerHour = this.getSelectedMachinePrice();
    return Math.round(pricePerHour * duration * 100) / 100; // Round to 2 decimal places
  }

  updatePrice(): void {
    // This will trigger the view to update the displayed price
    this.bookingForm.updateValueAndValidity();
  }

  getMinDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  getMaxDate(): string {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date.toISOString().split('T')[0];
  }


  async onSubmit(): Promise<void> {
    if (this.bookingForm.invalid) {
      Object.keys(this.bookingForm.controls).forEach(key => {
        const control = this.bookingForm.get(key);
        control?.markAsTouched();
        control?.updateValueAndValidity();
      });
      return;
    }

    this.isSubmitting = true;
    this.showError = false;
    this.showSuccess = false;

    try {
      const formValue = this.bookingForm.getRawValue(); 

   
      const currentUser = this.authService.getCurrentUser();

      const bookingData = {
        name: currentUser?.firstName || '',
        surname: currentUser?.lastName || '',
        email: currentUser?.email || '',
        phone: currentUser?.phone || '',
        machineType: formValue.machineType || '',
        pricePerHour: this.getSelectedMachinePrice(),
        bookingDate: formValue.bookingDate || '',
        bookingTime: formValue.bookingTime || '',
        duration: Number(formValue.duration) || 1,
        totalPrice: 0, // Will be calculated by SA pricing
        totalCalculatedPrice: 0,
        vatAmount: 0,
        subtotal: 0,
        discounts: 0,
        surcharges: 0
      };

      console.log("booking data:"  ,bookingData);

      await this.bookingService.createBookingWithSAPricing(bookingData);
      this.showSuccess = true;
      this.bookingForm.reset({ duration: 1 });
      this.loadBookedSlots();
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error: any) {
      this.showError = true;
      this.errorMessage = error.message || 'An error occurred while booking. Please try again.';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      this.isSubmitting = false;
    }
  }


  // async onSubmit(): Promise<void> {
  //   if (this.bookingForm.invalid) {
  //     // Mark all fields as touched to show validation errors
  //     Object.keys(this.bookingForm.controls).forEach(key => {
  //       const control = this.bookingForm.get(key);
  //       control?.markAsTouched();
  //       control?.updateValueAndValidity();
  //     });
  //     return;
  //   }

  //   this.isSubmitting = true;
  //   this.showError = false;
  //   this.showSuccess = false;

  //   try {
  //     const formValue = this.bookingForm.getRawValue();
  //     console.log('Form values:', formValue);

  //     // Get the price per hour for the selected machine
  //     const pricePerHour = this.getSelectedMachinePrice();
  //     const duration = Math.max(1, Number(formValue.duration) || 1);
  //     const totalPrice = this.getTotalPrice();

  //     // Prepare booking data with all required fields
  //     const bookingData = {
  //       role: formValue.role || 'Makerspace User',
  //       name: (formValue.name || '').trim(),
  //       surname: (formValue.surname || '').trim(),
  //       email: (formValue.email || '').trim().toLowerCase(),
  //       phone: (formValue.phone || '').trim(),
  //       machineType: formValue.machineType || '',
  //       pricePerHour: pricePerHour,
  //       bookingDate: formValue.bookingDate || '',
  //       bookingTime: formValue.bookingTime || '',
  //       duration: duration,
  //       totalPrice: totalPrice
  //     };

  //     console.log('Prepared booking data:', JSON.stringify(bookingData, null, 2));

  //     // Basic validation
  //     if (!bookingData.bookingDate || !bookingData.bookingTime || !bookingData.machineType) {
  //       throw new Error('Please fill in all required fields');
  //     }

  //     if (isNaN(bookingData.duration) || bookingData.duration <= 0) {
  //       throw new Error('Please enter a valid duration');
  //     }

  //     if (isNaN(bookingData.totalPrice) || bookingData.totalPrice <= 0) {
  //       throw new Error('Invalid price calculation. Please try again.');
  //     }

  //     console.log('Submitting booking data to server...');
  //     const newBooking = await this.bookingService.createBooking(bookingData);
      
  //     if (!newBooking) {
  //       throw new Error('Failed to create booking. Please try again.');
  //     }

  //     console.log('Booking created successfully:', newBooking);
  //     this.showSuccess = true;
  //     this.bookingForm.reset({ duration: 1 }); // Reset form but keep duration as 1
  //     this.loadBookedSlots();

  //     // Scroll to success message
  //     setTimeout(() => {
  //       window.scrollTo({ top: 0, behavior: 'smooth' });
  //     }, 100);

  //   } catch (error: any) {
  //     this.showError = true;
  //     this.errorMessage = error.message || 'An error occurred while booking. Please try again.';
  //     window.scrollTo({ top: 0, behavior: 'smooth' });
  //   } finally {
  //     this.isSubmitting = false;
  //   }
  // }

  closeSuccessMessage(): void {
    this.showSuccess = false;
  }

  closeErrorMessage(): void {
    this.showError = false;
  }
}

export type { Booking };
