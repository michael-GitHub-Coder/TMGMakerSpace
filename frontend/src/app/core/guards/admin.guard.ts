import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of, map, take } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.loggedIn$.pipe(
      map((loggedIn) => {
        const user = this.authService.getCurrentUser();
        console.log('AdminGuard check - loggedIn:', loggedIn, 'user:', user, 'user.role:', user?.role);

        // 1. Not logged in
        if (!loggedIn || !user) {
          console.log('AdminGuard: Not logged in, redirecting to signin');
          return this.router.createUrlTree(['/admin/signin']);
        }

        // 2. Not admin (case-insensitive comparison)
        const userRole = user.role?.toLowerCase();
        if (userRole !== 'admin' && userRole !== 'superadmin') {
          console.log('AdminGuard: Not admin role, redirecting to signin');
          return this.router.createUrlTree(['/admin/signin'], {
            queryParams: { error: 'admin_required' }
          });
        }

        // 3. OK
        console.log('AdminGuard: Access granted');
        return true;
      })
    );
  }
}