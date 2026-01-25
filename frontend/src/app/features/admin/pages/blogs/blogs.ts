import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../../shared/header/header';
import { FooterComponent } from '../../../../shared/footer/footer';

interface Blog {
  title: string;
  subtitle: string;
  description: string;
  dateTime: string;
  image?: string | ArrayBuffer | null;
}

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [FormsModule, CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './blogs.html',
})
export class BlogsComponent implements OnInit {
  blogs: Blog[] = [];
  newBlog: Blog = { title: '', subtitle: '', description: '', dateTime: '', image: '' };
  imagePreview: string | ArrayBuffer | null = '';

  constructor(private router: Router) {}

  ngOnInit() {
    const savedBlogs = localStorage.getItem('blogs');
    this.blogs = savedBlogs ? JSON.parse(savedBlogs) : [];
  }

  addBlog() {
    if (!this.newBlog.title || !this.newBlog.subtitle || !this.newBlog.description || !this.newBlog.dateTime) {
      alert('Please fill all required fields.');
      return;
    }

    const blogs = JSON.parse(localStorage.getItem('blogs') || '[]');
    blogs.push({ ...this.newBlog, image: this.imagePreview });
    localStorage.setItem('blogs', JSON.stringify(blogs));

    alert(`✅ Blog "${this.newBlog.title}" added successfully!`);

    // Navigate back to dashboard
    this.router.navigate(['/admin/dashboard']);
  }

  onImageUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
