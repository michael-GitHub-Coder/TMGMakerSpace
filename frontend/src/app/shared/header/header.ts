import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
  imports: [RouterModule, CommonModule],
})
export class HeaderComponent {
  menuOpen = false;
  loggedIn = false;

  constructor(public authService: AuthService) {
    // Subscribe to login state
    this.authService.loggedIn$.subscribe(state => {
      this.loggedIn = state;
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    const nav = document.querySelector('.nav-menu') as HTMLElement;
    nav.classList.toggle('active', this.menuOpen);
  }

  logout() {
    this.authService.logout();
  }
}
