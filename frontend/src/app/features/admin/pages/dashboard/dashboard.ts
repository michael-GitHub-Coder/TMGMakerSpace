import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, RouterLink } from '@angular/router';
import { SidebarComponent } from '../../../admin/shared/sidebar/sidebar';
import { BookingService, Booking } from '../../../../shared/booking/booking.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { BlogApiService, Blog } from '../../../../services/blog-api.service';

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
  imports: [CommonModule, RouterModule, RouterLink, SidebarComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})

export class DashboardComponent implements OnInit {
  name: string | null = null;
  role: string | null = null;
  members: Member[] = [];
  blogs: Blog[] = [];
  admins: Admin[] = [];
  bookings: Booking[] = [];
  blogToDelete: Blog | null = null;
  isDeleting = false;
  isLoading = false;

  constructor(private router: Router, private bookingService: BookingService, private authService: AuthService, private blogApiService: BlogApiService) {}

  ngOnInit() {
    this.name = this.authService.getCurrentUser()?.firstName || this.authService.getCurrentUser()?.name || 'Admin';
    this.role = localStorage.getItem('role');
    this.members = JSON.parse(localStorage.getItem('members') || '[]');
    this.admins = JSON.parse(localStorage.getItem('admins') || '[]');
    
    // Load real blogs from API
    this.loadBlogs();
    
    // Subscribe to bookings updates
    this.bookingService.bookings$.subscribe(bookings => {
      this.bookings = bookings;
    });
  }

  loadBlogs(): void {
    this.isLoading = true;
    this.blogApiService.getAllBlogs().subscribe({
      next: (blogs: Blog[]) => {
        this.blogs = blogs;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading blogs for dashboard:', error);
        this.blogs = [];
        this.isLoading = false;
      }
    });
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  getBlogsCount(): number { return this.blogs.length; }
  getMembersCount(): number { return this.members.length; }
  getAdminsCount(): number { return this.admins.length; }
  getBookingsCount(): number { return this.bookings.length; }

  // Delete functionality
  confirmDelete(blog: Blog) {
    this.blogToDelete = blog;
  }

  cancelDelete() {
    this.blogToDelete = null;
  }

  deleteBlog() {
    if (!this.blogToDelete) return;

    this.isDeleting = true;
    this.blogApiService.deleteBlog(this.blogToDelete.id).subscribe({
      next: () => {
        // Remove blog from local array
        this.blogs = this.blogs.filter(blog => blog.id !== this.blogToDelete!.id);
        
        // Reset modal state
        this.blogToDelete = null;
        this.isDeleting = false;
      },
      error: (error) => {
        console.error('Error deleting blog:', error);
        this.isDeleting = false;
      }
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  
}
