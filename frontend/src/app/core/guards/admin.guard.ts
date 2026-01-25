import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, map, of, switchMap } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.loggedIn$.pipe(
      switchMap(loggedIn => {
        if (!loggedIn) {
          return of(this.router.createUrlTree(['/admin/signin'], {
            queryParams: { returnUrl: this.router.url }
          }));
        }
        
        const user = this.authService.getCurrentUser();
        if (user?.role === 'admin') {
          return of(true);
        }
        
        // If not admin, redirect to signin with error
        return of(this.router.createUrlTree(['/admin/signin'], {
          queryParams: { error: 'admin_required' }
        }));
      })
    );
  }
}
