import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../admin/shared/sidebar/sidebar';
import { FooterComponent } from '../../../../shared/footer/footer';
import { HeaderComponent } from '../../../../shared/header/header';

interface BlogPost {
  id: number; // Must be unique
  title: string;
  subtitle?: string;
  description?: string;
  dateTime: string;
}

@Component({
  selector: 'app-blogs-management',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, HeaderComponent, FooterComponent],
  templateUrl: './blogs-management.html',
})
export class BlogsManagement implements OnInit {
  blogs: BlogPost[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    const savedBlogs = JSON.parse(localStorage.getItem('blogs') || '[]');

    // Assign unique IDs if they don’t exist
    this.blogs = savedBlogs.map((b: any, index: number) => ({
      id: b.id ?? index + 1,
      title: b.title,
      subtitle: b.subtitle,
      description: b.description,
      dateTime: b.dateTime,
    }));

    localStorage.setItem('blogs', JSON.stringify(this.blogs));
  }

  editBlog(id: number) {
    this.router.navigate([`/admin/blogs/edit/${id}`]);
  }

  deleteBlog(id: number) {
    if (confirm('Are you sure you want to delete this blog?')) {
      const savedBlogs = JSON.parse(localStorage.getItem('blogs') || '[]');

      // Filter out only the blog with matching ID
      const updatedBlogs = savedBlogs.filter((b: BlogPost) => b.id === undefined ? false : b.id !== id);

      localStorage.setItem('blogs', JSON.stringify(updatedBlogs));
      this.blogs = updatedBlogs;
    }
  }
}
