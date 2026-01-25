import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const user = this.authService.getUser(); 

    if (!user) {
      return this.router.createUrlTree(['/signin']);
    }

    // Check if route has a role restriction
    const expectedRole = route.data['role'];
    if (expectedRole && user.role !== expectedRole) {
      // User is logged in but does not have the right role
      // Redirect based on role
   
      if (user.role === 'admin') return this.router.createUrlTree(['/admin/dashboard']);
      if (user.role === 'member') return this.router.createUrlTree(['/member/dashboard']);
      return this.router.createUrlTree(['/home']); // default landing for users/clients
    }

    return true; // logged in and role is allowed
  }
}
