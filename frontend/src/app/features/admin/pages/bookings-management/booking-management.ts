import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../../admin/shared/sidebar/sidebar';
import { FooterComponent } from '../../../../shared/footer/footer';
import { HeaderComponent } from '../../../../shared/header/header';
import { BookingService, Booking } from '../../../../shared/booking/booking.service';

@Component({
  selector: 'app-bookings-management',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SidebarComponent, HeaderComponent],
  templateUrl: './bookings-management.html',
  styleUrls: ['./booking-management.css']
})
export class BookingsManagementComponent implements OnInit {
  bookings: Booking[] = [];
  filteredBookings: Booking[] = [];
  searchTerm = '';
  filterStatus: string = 'all';
  filterMachine: string = 'all';
  sortBy: string = 'date';
  sortOrder: 'asc' | 'desc' = 'desc';
  isLoading = true;
  error: string | null = null;
  confirmationMessage = '';
  pendingAction: (() => void) | null = null;

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.isLoading = true;
    this.error = null;
    
    // Subscribe to the booking service to get real-time updates
    this.bookingService.bookings$.subscribe({
      next: (bookings) => {
        console.log('Received bookings:', bookings);
        
        // Use the bookings as they are, since the service now handles normalization
        this.bookings = [...bookings];
        
        // Apply any active filters (don't reset filteredBookings first)
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load bookings:', err);
        this.error = 'Failed to load bookings. ' + (err.message || 'Please try again later.');
        this.isLoading = false;
        // Initialize with empty arrays to prevent template errors
        this.bookings = [];
        this.filteredBookings = [];
      }
    });
  }

  setSort(field: string): void {
    if (this.sortBy === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortOrder = 'asc';
    }
    this.applyFilters();
  }

  editBooking(booking: Booking): void {
    // Navigate to edit page or open edit modal
    console.log('Edit booking:', booking.id);
    // Implement edit functionality here
  }

  showCancelConfirmation(booking: Booking): void {
    if (confirm(`Are you sure you want to cancel the booking for ${booking.name}?`)) {
      this.cancelBooking(booking.id);
    }
  }

  showDeleteConfirmation(booking: Booking): void {
    if (confirm(`Are you sure you want to delete the booking for ${booking.name}? This action cannot be undone.`)) {
      this.deleteBooking(booking.id);
    }
  }

  async sendReminder(booking: Booking): Promise<void> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`Reminder sent for booking ${booking.id}`);
      // Show success message
      alert(`Reminder sent to ${booking.email}`);
    } catch (error) {
      console.error('Error sending reminder:', error);
      this.error = 'Failed to send reminder. Please try again.';
    }
  }

  applyFilters(): void {
    if (!this.bookings || !Array.isArray(this.bookings)) {
      console.warn('No bookings data available for filtering');
      this.filteredBookings = [];
      return;
    }

    // Start with a fresh copy of all bookings
    let filtered = [...this.bookings];

    // Apply search filter if search term exists
    if (this.searchTerm) {
      const searchTermLower = this.searchTerm.trim().toLowerCase();
      filtered = filtered.filter(booking => {
        if (!booking) return false;
        
        // Safely check each field with null/undefined checks
        const nameMatch = booking.name ? booking.name.toLowerCase().includes(searchTermLower) : false;
        const surnameMatch = booking.surname ? booking.surname.toLowerCase().includes(searchTermLower) : false;
        const emailMatch = booking.email ? booking.email.toLowerCase().includes(searchTermLower) : false;
        const phoneMatch = booking.phone ? booking.phone.includes(this.searchTerm.trim()) : false;
        const machineMatch = booking.machineType ? booking.machineType.toLowerCase().includes(searchTermLower) : false;
        const bookingIdMatch = booking.id ? booking.id.toLowerCase().includes(searchTermLower) : false;
        
        return nameMatch || surnameMatch || emailMatch || phoneMatch || machineMatch || bookingIdMatch;
      });
    }

    // Apply status filter
    if (this.filterStatus !== 'all') {
      filtered = filtered.filter(b => b.status === this.filterStatus);
    }

    // Apply machine filter
    if (this.filterMachine !== 'all') {
      filtered = filtered.filter(b => b.machineType === this.filterMachine);
    }

    // Sort the filtered results
    filtered.sort((a, b) => {
      let valueA: any, valueB: any;
      
      switch (this.sortBy) {
        case 'date':
          valueA = a.bookingDate && a.bookingTime 
            ? new Date(`${a.bookingDate}T${a.bookingTime}`).getTime() 
            : 0;
          valueB = b.bookingDate && b.bookingTime 
            ? new Date(`${b.bookingDate}T${b.bookingTime}`).getTime() 
            : 0;
          break;
        case 'name':
          valueA = `${a.name || ''} ${a.surname || ''}`.trim().toLowerCase();
          valueB = `${b.name || ''} ${b.surname || ''}`.trim().toLowerCase();
          break;
        case 'machineType':
          valueA = a.machineType?.toLowerCase() || '';
          valueB = b.machineType?.toLowerCase() || '';
          break;
        case 'duration':
          valueA = a.duration || 0;
          valueB = b.duration || 0;
          break;
        case 'totalPrice':
          valueA = a.totalPrice || 0;
          valueB = b.totalPrice || 0;
          break;
        case 'status':
          valueA = a.status?.toLowerCase() || '';
          valueB = b.status?.toLowerCase() || '';
          break;
        default:
          valueA = '';
          valueB = '';
      }

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return this.sortOrder === 'asc' 
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else {
        return this.sortOrder === 'asc'
          ? (valueA as number) - (valueB as number)
          : (valueB as number) - (valueA as number);
      }
    });

    this.filteredBookings = filtered;
  }

  getUniqueMachines(): string[] {
    if (!this.bookings || !Array.isArray(this.bookings)) {
      return [];
    }
    
    const machines = new Set<string>();
    this.bookings.forEach(booking => {
      if (booking && booking.machineType) {
        machines.add(booking.machineType);
      }
    });
    return Array.from(machines).sort();
  }

  async cancelBooking(id: string): Promise<void> {
    try {
      await this.bookingService.cancelBooking(id);
      // No need to call loadBookings() here as the subscription will handle the update
    } catch (error) {
      console.error('Error cancelling booking:', error);
      this.error = 'Failed to cancel booking. Please try again.';
    }
  }

  async deleteBooking(id: string): Promise<void> {
    try {
      await this.bookingService.deleteBooking(id);
      // No need to call loadBookings() here as the subscription will handle the update
    } catch (error) {
      console.error('Error deleting booking:', error);
      this.error = 'Failed to delete booking. Please try again.';
    }
  }

  getStatusClass(status: string): string {
    if (!status) return 'status-badge';
    
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'confirmed': 
        return 'badge bg-success bg-opacity-10 text-success';
      case 'pending': 
        return 'badge bg-warning bg-opacity-10 text-warning';
      case 'cancelled': 
        return 'badge bg-secondary bg-opacity-10 text-secondary';
      default: 
        return 'badge bg-light text-dark';
    }
  }

  getStatusIcon(status: string): string {
    if (!status) return 'bi-question-circle';
    
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'confirmed': 
        return 'bi-check-circle';
      case 'pending': 
        return 'bi-hourglass-split';
      case 'cancelled': 
        return 'bi-x-circle';
      default:
        return 'bi-question-circle';
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    try {
      // Handle both ISO format (YYYY-MM-DD) and other formats
      const date = dateString.includes('T') 
        ? new Date(dateString) 
        : new Date(dateString + 'T00:00:00');
      
      if (isNaN(date.getTime())) return 'Invalid Date';
      
      const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      };
      return date.toLocaleDateString(undefined, options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString; // Return original string if formatting fails
    }
  }

  formatTime(timeStr: string | undefined): string {
    if (!timeStr) return 'N/A';
    try {
      // Handle both HH:MM and HH:MM:SS formats
      const [hours, minutes] = timeStr.split(':').map(Number);
      
      if (isNaN(hours) || isNaN(minutes)) {
        return timeStr; // Return original if parsing fails
      }
      
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    } catch (error) {
      console.error('Error formatting time:', error);
      return timeStr; // Return original string if formatting fails
    }
  }

  getTotalRevenue(): number {
    // Only calculate revenue from confirmed bookings
    const confirmedBookings = this.filteredBookings.filter(b => b.status === 'confirmed');
    return confirmedBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  }

  getConfirmedBookingsCount(): number {
    return this.filteredBookings.filter(b => b.status === 'confirmed').length;
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.filterStatus = 'all';
    this.filterMachine = 'all';
    this.sortBy = 'date';
    this.sortOrder = 'desc';
    this.applyFilters();
  }
  
  // Format price for display
  
  // Format price for display
  formatPrice(price: number): string {
    if (price === undefined || price === null) return 'R0.00';
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2
    }).format(price);
  }

  showConfirmation(message: string, action: () => void): void {
    this.confirmationMessage = message;
    this.pendingAction = action;
    // You'll need to import and inject the NgbModal service to show the modal
    // For now, we'll use a simple confirm dialog
    if (confirm(message)) {
      action();
    }
  }

  confirmAction(): void {
    if (this.pendingAction) {
      this.pendingAction();
      this.pendingAction = null;
    }
  }

  exportToCSV(): void {
    const headers = ['Date', 'Time', 'Name', 'Surname', 'Email', 'Phone', 'Role', 'Machine', 'Duration', 'Price', 'Status'];
    const rows = this.filteredBookings.map(b => [
      b.bookingDate,
      b.bookingTime,
      b.name,
      b.surname,
      b.email,
      b.phone,
      // b.role,
      b.machineType,
      b.duration,
      b.totalPrice,
      b.status
    ]);

    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}