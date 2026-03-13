import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../shared/services/auth.service';
import { catchError, finalize, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.html',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  standalone: true,
  styleUrls: ['./signin.css']
})
export class SigninComponent {
  email = '';
  password = '';
  rememberMe = false;
  error: string | null = null;
  isLoading = false;
  isAdminOnly = true;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.email || !this.password) {
      this.error = 'Please enter both email and password';
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.authService.login({
      email: this.email,
      password: this.password,
      rememberMe: this.rememberMe
    }).pipe(
      map(response => response.status === 'success'),
      catchError(error => {
        console.error('Login error:', error);
        this.error = error.error?.message || error.message || 'An error occurred during login. Please try again.';
        return of(false);
      }),
      finalize(() => this.isLoading = false)
    ).subscribe(success => {
      if (success) {

        const user = this.authService.getUser();
        localStorage.setItem('role', user.role);

        if (user?.role === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        } else if (user?.role === 'member') {
          this.router.navigate(['/member/dashboard']);
        } else {
          this.router.navigate(['/']); // fallback if role unknown
        }
      } else if (!this.error) {
        this.error = 'Invalid email or password';
      }
    });
  }


  // onSubmit() {
  //   if (!this.email || !this.password) {
  //     this.error = 'Please enter both email and password';
  //     return;
  //   }

  //   this.isLoading = true;
  //   this.error = null;

  //   this.authService.login({
  //     email: this.email,
  //     password: this.password,
  //     rememberMe: this.rememberMe
  //   }).pipe(
  //     map(response => response.status === 'success'),
  //     catchError(error => {
  //       console.error('Login error:', error);
  //       this.error = error.error?.message || error.message || 'An error occurred during login. Please try again.';
  //       return of(false);
  //     }),
  //     finalize(() => this.isLoading = false)
  //   ).subscribe(success => {
  //     if (success) {
  //       this.router.navigate(['/admin/dashboard']);
  //     } else if (!this.error) {
  //       this.error = 'Invalid email or password';
  //     }
  //   });
  // }

  // onSubmit() {
  //   if (!this.email || !this.password) {
  //     this.error = 'Please enter both email and password';
  //     return;
  //   }

  //   this.isLoading = true;
  //   this.error = null;

  //   this.authService.login({
  //     email: this.email,
  //     password: this.password,
  //     rememberMe: this.rememberMe
  //   }).pipe(
  //     catchError(error => {
  //       console.error('Login error:', error);
  //       this.error = error.error?.message || error.message || 'An error occurred during login. Please try again.';
  //       return of(false);
  //     }),
  //     finalize(() => this.isLoading = false)
  //   ).subscribe(success => {
  //     if (success) {
  //       this.router.navigate(['/admin/dashboard']);
  //     } else if (!this.error) {
  //       this.error = 'Invalid email or password';
  //     }
  //   });
  // }
}