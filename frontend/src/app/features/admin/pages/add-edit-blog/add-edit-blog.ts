import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../../shared/header/header';
import { FooterComponent } from '../../../../shared/footer/footer';
import { SidebarComponent } from '../../../admin/shared/sidebar/sidebar';

interface BlogPost {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  dateTime: string;
}

@Component({
  selector: 'app-add-edit-blog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent, FooterComponent, SidebarComponent],
  templateUrl: './add-edit-blog.html',
  styleUrls: ['./add-edit-blog.css']
})
export class AddEditBlogComponent implements OnInit {
  blog: BlogPost = {
    id: Date.now(),
    title: '',
    subtitle: '',
    description: '',
    image: '',
    dateTime: new Date().toISOString(),
  };

  isEditMode = false;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      const blogs = JSON.parse(localStorage.getItem('blogs') || '[]');
      const existing = blogs.find((b: BlogPost) => b.id === Number(id));
      if (existing) this.blog = existing;
    }
  }

  onImageUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => (this.blog.image = reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  saveBlog() {
    if (!this.blog.title) {
      alert('Please enter a blog title.');
      return;
    }

    const blogs = JSON.parse(localStorage.getItem('blogs') || '[]');

    if (this.isEditMode) {
      const index = blogs.findIndex((b: BlogPost) => b.id === this.blog.id);
      if (index !== -1) blogs[index] = this.blog;
    } else {
      blogs.unshift(this.blog);
    }

    localStorage.setItem('blogs', JSON.stringify(blogs));
    alert(`✅ Blog ${this.isEditMode ? 'updated' : 'added'} successfully!`);
    this.router.navigate(['/admin/blogs-management']);
  }
}
