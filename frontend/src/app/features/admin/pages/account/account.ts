import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HeaderComponent } from '../../../../shared/header/header';
import { FooterComponent } from '../../../../shared/footer/footer';
import { SidebarComponent } from '../../../admin/shared/sidebar/sidebar';
import { BookingService, Booking } from '../../../../shared/booking/booking.service';
import { AuthService } from '../../../../shared/services/auth.service';

interface User {
  name: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, SidebarComponent, FooterComponent],
  templateUrl: './account.html',
  styleUrls: ['./account.css']
})
export class AccountComponent implements OnInit {
  currentUser: User | null = null;
  bookings: Booking[] = [];
  name: string | null = null;
  surname: string | null = null;
  email: string | null = null;
  role: string | null = null;
 

  constructor(private router: Router, private bookingService: BookingService,private authService: AuthService) {}

  ngOnInit(): void {

    const user = this.authService.getCurrentUser();

    this.role = user?.role || 'Role';
    this.name = user?.firstName || user?.name || 'Name';
    this.email = user?.email || 'Email';
    this.surname = user?.lastName || 'Surname';
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    // Load bookings for this user
    this.bookingService.bookings$.subscribe(allBookings => {
      this.bookings = allBookings.filter(b => b.email === this.currentUser?.email);
    });
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  editProfile() {
    alert('Edit profile functionality coming soon!');
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}
