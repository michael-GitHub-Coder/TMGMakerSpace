import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HeaderComponent } from '../../../../shared/header/header';
import { FooterComponent } from '../../../../shared/footer/footer';
import { SidebarComponent } from '../../../admin/shared/sidebar/sidebar';

interface Admin {
  name: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent, SidebarComponent],
  templateUrl: './account.html',
  styleUrls: ['./account.css']
})
export class AccountComponent implements OnInit {
  role: string | null = null;
  currentAdmin: Admin | null = null;
  admins: Admin[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.role = localStorage.getItem('role');
    this.currentAdmin = JSON.parse(localStorage.getItem('currentAdmin') || 'null');

    if (this.role === 'superadmin') {
      this.admins = JSON.parse(localStorage.getItem('admins') || '[]');
    }
  }

  logout() {
    localStorage.removeItem('role');
    localStorage.removeItem('currentAdmin');
    this.router.navigate(['/admin/signin']);
  }

  deleteAdmin(email: string) {
    if (confirm('Are you sure you want to delete this admin?')) {
      this.admins = this.admins.filter(a => a.email !== email);
      localStorage.setItem('admins', JSON.stringify(this.admins));
    }
  }
}
