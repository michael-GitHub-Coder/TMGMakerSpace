import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent implements OnInit {
  role: string | null = null;
  isSidebarOpen = false;

  
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.role = localStorage.getItem('role');

    // Also check from auth service
    const user = this.authService.getUser();

    // Use auth service role if localStorage is empty
    if (!this.role && user?.role) {
      this.role = user.role;
    }

    console.log('Sidebar initialized - role from localStorage:', this.role, 'user from auth:', user);
  }

  navigate(route: string) {
    this.router.navigate([route]);
    this.isSidebarOpen = false; 
  }

  navigateToDashboard() {
    // Navigate based on user role
    if (this.shouldShowAdminFeatures()) {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/member/dashboard']);
    }
    this.isSidebarOpen = false;
  }

  navigateToAccount() {
    // Navigate based on user role
    if (this.shouldShowAdminFeatures()) {
      this.router.navigate(['/admin/account']);
    } else {
      this.router.navigate(['/member/account']);
    }
    this.isSidebarOpen = false;
  }

  navigateToBookings() {
    // Navigate to bookings page for members
    this.router.navigate(['/booking']);
    this.isSidebarOpen = false;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  // Method to determine if admin features should be shown
  shouldShowAdminFeatures(): boolean {
    const isAdmin = this.role?.toLowerCase() === 'admin' || this.role?.toLowerCase() === 'superadmin';

    // Also check auth service as fallback
    const user = this.authService.getUser();
    const isUserAdmin = user?.role?.toLowerCase() === 'admin' || user?.role?.toLowerCase() === 'superadmin';

    console.log('shouldShowAdminFeatures - isAdmin:', isAdmin, 'isUserAdmin:', isUserAdmin, 'role:', this.role, 'user.role:', user?.role);

    return isAdmin || isUserAdmin;
  }

  logout() {
    console.log('🚀 SIDEBAR: Logout clicked');
    this.authService.logout().subscribe({
      next: (response) => {
        console.log('🚀 SIDEBAR: Logout successful:', response);
      },
      error: (error) => {
        console.error('🚀 SIDEBAR: Logout error:', error);
      }
    });
  }
}
