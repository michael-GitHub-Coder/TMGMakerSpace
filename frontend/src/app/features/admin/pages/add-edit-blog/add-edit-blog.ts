import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../../shared/header/header';
import { FooterComponent } from '../../../../shared/footer/footer';
import { SidebarComponent } from '../../../admin/shared/sidebar/sidebar';
import { BlogApiService, CreateBlogRequest, Blog } from '../../../../services/blog-api.service';

@Component({
  selector: 'app-add-edit-blog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent, FooterComponent, SidebarComponent],
  templateUrl: './add-edit-blog.html',
  styleUrls: ['./add-edit-blog.css']
})
export class AddEditBlogComponent implements OnInit {
  blog: CreateBlogRequest = {
    title: '',
    subtitle: '',
    description: '',
    image: '',
    author: '',
    tags: [],
    content: '',
    published: true,
  };

  isEditMode = false;
  blogId?: number;
  isLoading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private blogApiService: BlogApiService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.blogId = Number(id);
      this.loadBlog(this.blogId);
    }
  }

  loadBlog(id: number) {
    this.isLoading = true;
    this.blogApiService.getBlogById(id).subscribe({
      next: (blog: Blog) => {
        this.blog = {
          title: blog.title,
          subtitle: blog.subtitle,
          description: blog.description,
          image: blog.image,
          author: blog.author,
          tags: blog.tags,
          content: blog.content,
          published: blog.published,
        };
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load blog post';
        this.isLoading = false;
        console.error('Error loading blog:', error);
      }
    });
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
    if (!this.blog.title || this.blog.title.trim() === '') {
      this.errorMessage = 'Please enter a blog title.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    if (this.isEditMode && this.blogId) {
      this.blogApiService.updateBlog(this.blogId, this.blog).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/admin/blogs-management']);
        },
        error: (error) => {
          this.errorMessage = 'Failed to update blog post';
          this.isLoading = false;
          console.error('Error updating blog:', error);
        }
      });
    } else {
      this.blogApiService.createBlog(this.blog).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/admin/blogs-management']);
        },
        error: (error) => {
          this.errorMessage = 'Failed to create blog post';
          this.isLoading = false;
          console.error('Error creating blog:', error);
        }
      });
    }
  }
}
