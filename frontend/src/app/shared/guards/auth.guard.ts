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

    // Check if route has a role restriction (case-insensitive)
    const expectedRole = route.data['role'];
    const userRole = user.role?.toLowerCase();
    if (expectedRole && userRole !== expectedRole.toLowerCase()) {
      // User is logged in but does not have the right role
      // Redirect based on role

      if (userRole === 'admin' || userRole === 'superadmin') return this.router.createUrlTree(['/admin/dashboard']);
      if (userRole === 'member') return this.router.createUrlTree(['/member/dashboard']);
      return this.router.createUrlTree(['/home']);
    }

    return true; // logged in and role is allowed
  }
}
