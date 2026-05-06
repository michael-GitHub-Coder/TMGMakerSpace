import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../shared/services/auth.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  signInForm: FormGroup;
  hidePassword = true;
  isLoading = false;
  error: string | null = null;
  returnUrl: string = '/dashboard';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    // Get return url from route parameters or default to '/dashboard'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    
    // Clear form to ensure empty fields
    this.clearForm();
    
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  // Clear form to ensure empty fields
  clearForm(): void {
    this.signInForm.patchValue({
      email: '',
      password: '',
      rememberMe: false
    });
    
    // Remove readonly attributes to allow input
    setTimeout(() => {
      const emailInput = document.getElementById('email') as HTMLInputElement;
      const passwordInput = document.getElementById('password') as HTMLInputElement;
      
      if (emailInput) {
        emailInput.removeAttribute('readonly');
        emailInput.focus();
      }
      
      if (passwordInput) {
        passwordInput.removeAttribute('readonly');
      }
    }, 100);
  }

  onSubmit() {
    if (this.signInForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.error = null;

    const { email, password, rememberMe } = this.signInForm.value;

    this.authService.login({ email, password, rememberMe }).pipe(
      map(response => response.status === 'success')
    ).subscribe({
      next: (success) => {
        if (success) {
          // Clear form after successful login
          this.clearForm();
          
          // Check if user logged in with OTP and must change password
          const user = this.authService.getUser();
          if (user?.mustChangePassword) {
            console.log('🔐 User logged in with OTP - forcing password change');
            // Set OTP login flag for account page to detect
            sessionStorage.setItem('otp_login', 'true');
            // Redirect to account page with password change requirement
            this.router.navigate(['/member/account']);
          } else {
            this.router.navigate([this.returnUrl]);
          }
        } else {
          this.error = 'Invalid email or password. Please try again.';
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        this.error = 'An error occurred during login. Please try again.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  navigateToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
}
