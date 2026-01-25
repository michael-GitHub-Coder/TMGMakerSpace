import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SidebarComponent } from '../../../admin/shared/sidebar/sidebar';
import { FooterComponent } from '../../../../shared/footer/footer';
import { HeaderComponent } from '../../../../shared/header/header';
import { BookingService, Booking } from '../../../../shared/booking/booking.service';

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

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, FooterComponent, HeaderComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})



export class DashboardComponent implements OnInit {
  role: string | null = null;
  members: Member[] = [];
  blogs: BlogPost[] = [];
  admins: Admin[] = [];
  bookings: Booking[] = [];

  constructor(private router: Router, private bookingService: BookingService) {}

  ngOnInit() {
    this.role = localStorage.getItem('role');
    this.members = JSON.parse(localStorage.getItem('members') || '[]');
    this.blogs = JSON.parse(localStorage.getItem('blogs') || '[]');
    this.admins = JSON.parse(localStorage.getItem('admins') || '[]');
    
    // Subscribe to bookings updates
    this.bookingService.bookings$.subscribe(bookings => {
      this.bookings = bookings;
    });
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  getBlogsCount(): number { return this.blogs.length; }
  getMembersCount(): number { return this.members.length; }
  getAdminsCount(): number { return this.admins.length; }
  getBookingsCount(): number { return this.bookings.length; }
  
}
