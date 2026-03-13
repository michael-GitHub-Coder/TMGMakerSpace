import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent implements OnInit {
  role: string | null = null;
  isSidebarOpen = false;

  
  constructor(private router: Router) {}

  ngOnInit() {
    this.role = localStorage.getItem('role');
    console.log('User role in sidebar ke:', this.role);
  }

  navigate(route: string) {
    this.router.navigate([route]);
    this.isSidebarOpen = false; 
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
