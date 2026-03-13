import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SidebarComponent } from '../../admin/shared/sidebar/sidebar';
import { FooterComponent } from '../../../shared/footer/footer';
import { HeaderComponent } from '../../../shared/header/header';
import { BookingComponent,Booking } from '../../public/pages/booking/booking';
import { BookingService } from '../../../shared/booking/booking.service';
import { AuthService } from '../../../shared/services/auth.service';

interface Member {
  name: string;
  joinedAt: string;
}

interface BlogPost {
  title: string;
  subtitle: string;
  description: string;
  dateTime: string;
}

interface Admin {
  name: string;
  email: string;
  role: string;
}

// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [CommonModule, RouterModule, SidebarComponent, HeaderComponent],
//   templateUrl: './mdashboard.html',
//   styleUrls: ['./mdashboard.css']
// })

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule,SidebarComponent, HeaderComponent],
  templateUrl: './mdashboard.html',
  styleUrls: ['./mdashboard.css']
})

export class DashboardComponent2 implements OnInit {
  name: string | null = null;
  role: string | null = null;
  email: string | null = null;
  bookings: Booking[] = [];

  constructor(
    private router: Router,
    private bookingService: BookingService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();

    this.email = user?.email || null;
    this.name = user?.firstName || user?.name || 'Member';
    this.role = user?.role || null;

    if (this.email) {
      this.loadMyBookings(this.email);
    }
  }

  loadMyBookings(email: string) {
    this.bookingService.findByEmail(email).subscribe({
      next: (bookings: Booking[]) => {
        this.bookings = bookings;
      },
      error: () => {
        this.bookings = [];
      }
    });
  }

  tot_bookings(): number {
    return this.bookings.length;
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}


