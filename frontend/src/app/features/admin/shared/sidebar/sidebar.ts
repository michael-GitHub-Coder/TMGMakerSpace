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
    console.log('🔍 SIDEBAR: User role detected:', this.role);
    console.log('🔍 SIDEBAR: localStorage role:', localStorage.getItem('role'));
    
    // Also check from auth service
    const user = this.authService.getUser();
    console.log('🔍 SIDEBAR: Auth service user:', user);
    console.log('🔍 SIDEBAR: Auth service role:', user?.role);
    
    // Use auth service role if localStorage is empty
    if (!this.role && user?.role) {
      this.role = user.role;
      console.log('🔍 SIDEBAR: Using auth service role:', this.role);
    }
  }

  navigate(route: string) {
    this.router.navigate([route]);
    this.isSidebarOpen = false; 
  }

  navigateToAccount() {
    console.log('🔍 SIDEBAR: Account clicked, role:', this.role);
    
    // Always navigate to admin account for admin sidebar
    this.router.navigate(['/admin/account']);
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
    const isAdmin = this.role === 'admin' || this.role === 'superadmin';
    
    // Also check auth service as fallback
    const user = this.authService.getUser();
    const isUserAdmin = user?.role === 'admin' || user?.role === 'superadmin';
    
    console.log('🔍 SIDEBAR: shouldShowAdminFeatures check:');
    console.log('  - Role from localStorage:', this.role);
    console.log('  - Role from auth service:', user?.role);
    console.log('  - isAdmin:', isAdmin);
    console.log('  - isUserAdmin:', isUserAdmin);
    console.log('  - Final result:', isAdmin || isUserAdmin);
    
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
