import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly tokenKey: string;
  private readonly userKey: string;
  private readonly loginUrl = '/sign-in';

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject('ENVIRONMENT') private env: any
  ) {
    this.tokenKey = this.env.tokenKey || 'auth_token';
    this.userKey = this.env.userKey || 'user_data';
  }

  private safeLocalStorageGetItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn('localStorage access blocked in interceptor');
      return null;
    }
  }

  private safeSessionStorageGetItem(key: string): string | null {
    try {
      return sessionStorage.getItem(key);
    } catch (e) {
      console.warn('sessionStorage access blocked in interceptor');
      return null;
    }
  }

  private safeLocalStorageRemoveItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('localStorage access blocked in interceptor');
    }
  }

  private safeSessionStorageRemoveItem(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (e) {
      console.warn('sessionStorage access blocked in interceptor');
    }
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip for SSR
    if (!isPlatformBrowser(this.platformId)) {
      return next.handle(request);
    }

    // Skip adding token for login/register endpoints and public blog endpoints
    if (request.url.includes('/auth/') || request.url.includes('/blogs')) {
      return next.handle(request);
    }

    // Get the auth token from storage
    const token = this.getToken();
    
    // Clone the request and add the authorization header
    if (token) {
      request = request.clone({
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        })
      });
    }

    // Send the request and handle errors
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle 401 Unauthorized responses
        if (error.status === 401) {
          // Clear auth data
          if (isPlatformBrowser(this.platformId)) {
            this.safeLocalStorageRemoveItem(this.tokenKey);
            this.safeLocalStorageRemoveItem(this.userKey);
            this.safeSessionStorageRemoveItem(this.tokenKey);
            this.safeSessionStorageRemoveItem(this.userKey);
          }
          
          // Navigate to login page with return URL if not already there
        if (!this.router.url.includes(this.loginUrl)) {
          this.router.navigate([this.loginUrl], {
            queryParams: { 
              returnUrl: this.router.routerState.snapshot.url === '/sign-in' 
                ? '/' 
                : this.router.routerState.snapshot.url 
            }
          });
        }
        }
        return throwError(() => error);
      })
    );
  }

  private getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return this.safeLocalStorageGetItem(this.tokenKey) || this.safeSessionStorageGetItem(this.tokenKey);
  }
}
