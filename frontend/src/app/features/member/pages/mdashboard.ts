import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SidebarComponent } from '../../admin/shared/sidebar/sidebar';
import { FooterComponent } from '../../../shared/footer/footer';
import { HeaderComponent } from '../../../shared/header/header';
import { BookingComponent,Booking } from '../../public/pages/booking/booking';
import { BookingService } from '../../../shared/booking/booking.service';
import { AuthService } from '../../../shared/services/auth.service';
import { BlogApiService, Blog } from '../../../services/blog-api.service';

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
  blogs: Blog[] = [];
  isMember: boolean = false;

  constructor(
    private router: Router,
    private bookingService: BookingService,
    private authService: AuthService,
    private blogApiService: BlogApiService
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.name = user?.firstName || user?.name || 'Member';
    this.email = user?.email || 'member@example.com';
    this.role = localStorage.getItem('role');
    this.isMember = this.role?.toLowerCase() === 'member';
    
    // Load real blogs from API
    this.loadBlogs();
    
    // Subscribe to bookings updates
    this.bookingService.bookings$.subscribe(bookings => {
      this.bookings = bookings;
    });
  }

  loadBlogs(): void {
    this.blogApiService.getAllBlogs().subscribe({
      next: (blogs: Blog[]) => {
        this.blogs = blogs;
      },
      error: (error) => {
        console.error('Error loading blogs for member dashboard:', error);
        this.blogs = [];
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


