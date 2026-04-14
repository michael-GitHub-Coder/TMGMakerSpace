import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export interface LoginResponse {
  status: string;
  message: string;
  token: string;
  data: {
    user: any;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';
  private readonly apiUrl = 'http://localhost:3000/api/v1'; 
  private loggedIn = new BehaviorSubject<boolean>(false);
  loggedIn$ = this.loggedIn.asObservable();
  private user: any = null;

  getCurrentUser(): any {
    if (!this.user && this.isBrowser) {
      const userData = this.safeLocalStorageGetItem(this.USER_KEY);
      if (userData) {
        try {
          this.user = JSON.parse(userData);
        } catch (e) {
          console.error('Failed to parse user data', e);
        }
      }
    }
    return this.user;
  }

  // Simple in-memory storage fallback
  private memoryStorage = new Map<string, string>();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject('ENVIRONMENT') private env: any
  ) {
    this.TOKEN_KEY = this.env.tokenKey || 'auth_token';
    this.USER_KEY = this.env.userKey || 'user_data';
    this.apiUrl = this.env.apiUrl || 'http://localhost:3000/api/v1';
    // Initialize auth state from storage if available
    if (this.isBrowser) {
      this.initializeAuthState();
    }
  }

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private initializeAuthState(): void {
    const token = this.getToken();
    if (token) {
      // Optionally validate token with the server here
      this.loggedIn.next(true);
      this.user = this.getUser();
    }
  }

  private safeLocalStorageGetItem(key: string): string | null {
    try {
      // Try localStorage first
      return localStorage.getItem(key);
    } catch (e) {
      console.warn('localStorage access blocked, trying sessionStorage');
      try {
        // Fallback to sessionStorage
        return sessionStorage.getItem(key);
      } catch (e2) {
        console.warn('sessionStorage also blocked, using memory fallback');
        // Last resort: use in-memory storage
        return this.memoryStorage.get(key) || null;
      }
    }
  }

  private safeLocalStorageSetItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn('localStorage access blocked, trying sessionStorage');
      try {
        sessionStorage.setItem(key, value);
      } catch (e2) {
        console.warn('sessionStorage also blocked, using memory fallback');
        this.memoryStorage.set(key, value);
      }
    }
  }

  private safeLocalStorageRemoveItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('localStorage access blocked');
    }
  }

  private safeSessionStorageGetItem(key: string): string | null {
    try {
      return sessionStorage.getItem(key);
    } catch (e) {
      console.warn('sessionStorage access blocked, using memory fallback');
      // Fallback to in-memory storage
      return this.memoryStorage.get(key) || null;
    }
  }

  private safeSessionStorageSetItem(key: string, value: string): void {
    try {
      sessionStorage.setItem(key, value);
    } catch (e) {
      console.warn('sessionStorage access blocked, using memory fallback');
      this.memoryStorage.set(key, value);
    }
  }

  private safeSessionStorageRemoveItem(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (e) {
      console.warn('sessionStorage access blocked');
    }
  }

  login(credentials: { email: string; password: string; rememberMe: boolean }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/signin`, credentials).pipe(
      tap(response => {
        if (response.status === 'success' && response.token) {
          const user = response.data.user;
          this.setToken(response.token, credentials.rememberMe);
          this.setUser(user);
          this.loggedIn.next(true);
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        throw error;
      })
    );
  }

  

  // login(credentials: { email: string; password: string; rememberMe: boolean }): Observable<boolean> {
  //   return this.http.post<LoginResponse>(`${this.apiUrl}/auth/signin`, credentials).pipe(
  //     tap(response => {
  //       if (response.status === 'success' && response.token) {
  //         // Check if user has admin role
  //         const user = response.data.user;
  //         if (user.role !== 'admin') {
  //           throw new Error('Access denied. Admin privileges required.');
  //         }
          
  //         this.setToken(response.token, credentials.rememberMe);
  //         this.setUser(user);
  //         this.loggedIn.next(true);
  //       }
  //     }),
  //     map(response => response.status === 'success'),
  //     catchError(error => {
  //       console.error('Login error:', error);
  //       if (error.status === 403) {
  //         throw new Error('Access denied. Admin privileges required.');
  //       }
  //       throw error;
  //     })
  //   );
  // }

  register(userData: { firstName: string; lastName: string; email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/signup`, userData).pipe(
      tap(response => {
        if (response.status === 'success' && response.token) {
          this.setToken(response.token, false);
          this.setUser(response.data.user);
          this.loggedIn.next(true);
        }
      }),
      catchError(error => {
        console.error('Registration error:', error);
        throw error;
      })
    );
  }

  logout(): void {
    if (this.isBrowser) {
      this.safeLocalStorageRemoveItem(this.TOKEN_KEY);
      this.safeLocalStorageRemoveItem(this.USER_KEY);
      this.safeSessionStorageRemoveItem(this.TOKEN_KEY);
      this.safeSessionStorageRemoveItem(this.USER_KEY);
    }
    this.user = null;
    this.loggedIn.next(false);
    this.router.navigate(['/sign-in']);
  }

  isLoggedIn(): boolean {
    return this.loggedIn.value;
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return this.safeLocalStorageGetItem(this.TOKEN_KEY) || this.safeSessionStorageGetItem(this.TOKEN_KEY);
  }

  getUser(): any {
    if (!this.isBrowser) return null;
    if (this.user) return this.user;
    
    const userData = this.safeLocalStorageGetItem(this.USER_KEY) || this.safeSessionStorageGetItem(this.USER_KEY);
    this.user = userData ? JSON.parse(userData) : null;
    return this.user;
  }

  getAuthHeader(): { [header: string]: string } {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  private setToken(token: string, rememberMe: boolean): void {
    if (!this.isBrowser) return;
    
    if (rememberMe) {
      this.safeLocalStorageSetItem(this.TOKEN_KEY, token);
    } else {
      this.safeSessionStorageSetItem(this.TOKEN_KEY, token);
    }
  }

  private setUser(user: any): void {
    if (!this.isBrowser) return;
    
    this.user = user;
    const userData = JSON.stringify(user);
    
    // Store user data in the same storage as the token
    if (this.safeLocalStorageGetItem(this.TOKEN_KEY)) {
      this.safeLocalStorageSetItem(this.USER_KEY, userData);
    } else {
      this.safeSessionStorageSetItem(this.USER_KEY, userData);
    }
  }
}
