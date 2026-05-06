import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../../shared/services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './account.html',
  styleUrls: ['./account.css']
})
export class AccountComponent implements OnInit {
  name: string = '';
  email: string = '';
  role: string = '';
  joinedAt: string = '';
  
  // Password update properties
  showPasswordModal: boolean = false;
  isUpdating: boolean = false;
  passwordForm = {
    newPassword: '',
    confirmPassword: ''
  };
  
  // OTP notification
  showOtpNotification: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // Get user information from auth service
    const user = this.authService.getCurrentUser();
    this.name = user?.firstName || user?.name || 'Member';
    this.email = user?.email || 'member@example.com';
    this.role = user?.role || 'member';
    this.joinedAt = user?.joinedAt || new Date().toLocaleDateString();
    
    // Check if user logged in with OTP and show notification
    this.checkOtpLogin();
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  navigateToDashboard() {
    this.router.navigate(['/member/dashboard']);
  }

  // Password update methods
  closePasswordModal() {
    // Prevent closing modal if OTP login is active (forcing password change)
    const isOtpLogin = sessionStorage.getItem('otp_login') === 'true';
    if (isOtpLogin) {
      alert('You must update your password to continue using the application.');
      return;
    }
    
    this.showPasswordModal = false;
    this.resetPasswordForm();
  }

  resetPasswordForm() {
    this.passwordForm = {
      newPassword: '',
      confirmPassword: ''
    };
  }

  updatePassword() {
    // Validate passwords
    if (!this.passwordForm.newPassword || !this.passwordForm.confirmPassword) {
      alert('Please fill in all password fields');
      return;
    }

    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (this.passwordForm.newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    this.isUpdating = true;
    const user = this.authService.getCurrentUser();
    
    // Call password update API
    this.http.post('http://localhost:3000/api/v1/auth/change-password', {
      userId: user?.id,
      newPassword: this.passwordForm.newPassword
    }).subscribe({
      next: (response: any) => {
        this.isUpdating = false;
        if (response.status === 'success') {
          alert('Password updated successfully!');
          this.closePasswordModal();
          // Clear OTP login flag after successful password update
          sessionStorage.removeItem('otp_login');
          sessionStorage.removeItem('otp_notification_seen');
          // Set password change success flag for dashboard to detect
          sessionStorage.setItem('password_change_success', 'true');
          setTimeout(() => {
            this.router.navigate(['/member/dashboard']);
          }, 1000);
        } else {
          alert(response.message || 'Failed to update password');
        }
      },
      error: (error) => {
        this.isUpdating = false;
        console.error('Password update error:', error);
        alert(error.error?.message || 'Failed to update password. Please check your current password.');
      }
    });
  }

  // OTP notification methods
  checkOtpLogin() {
    // Check if user logged in with OTP (you can set a flag in auth service or localStorage during OTP login)
    const isOtpLogin = sessionStorage.getItem('otp_login') === 'true';
    const hasSeenNotification = sessionStorage.getItem('otp_notification_seen') === 'true';
    
    if (isOtpLogin && !hasSeenNotification) {
      // Show notification after a short delay
      setTimeout(() => {
        this.showOtpNotification = true;
      }, 2000);
    }
  }
}
