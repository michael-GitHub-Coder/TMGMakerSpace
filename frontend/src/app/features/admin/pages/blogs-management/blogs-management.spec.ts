import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SidebarComponent } from '../../../admin/shared/sidebar/sidebar';
import { HeaderComponent } from '../../../../shared/header/header';
import { FooterComponent } from '../../../../shared/footer/footer';

interface BlogPost {
  id: number;
  title: string;
  subtitle: string;
  dateTime: string;
  author?: string;
}

@Component({
  selector: 'app-blogs-management',
  standalone: true,
  imports: [CommonModule, SidebarComponent, HeaderComponent, FooterComponent],
  templateUrl: './blogs-management.html',
})
export class BlogsManagementComponent implements OnInit {
  blogs: BlogPost[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.blogs = JSON.parse(localStorage.getItem('blogs') || '[]');
  }

  editBlog(id: number) {
    this.router.navigate([`/admin/blogs/edit/${id}`]);
  }

  deleteBlog(id: number) {
    this.blogs = this.blogs.filter(b => b.id !== id);
    localStorage.setItem('blogs', JSON.stringify(this.blogs));
  }
}
