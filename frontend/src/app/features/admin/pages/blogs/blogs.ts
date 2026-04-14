import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../../shared/header/header';
import { FooterComponent } from '../../../../shared/footer/footer';
import { BlogApiService, CreateBlogRequest, Blog } from '../../../../services/blog-api.service';
import { BlogRefreshService } from '../../../../services/blog-refresh.service';

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [FormsModule, CommonModule, HeaderComponent, FooterComponent, RouterLink],
  templateUrl: './blogs.html',
})
export class BlogsComponent implements OnInit {
  newBlog: CreateBlogRequest = { title: '', description: '', content: '', published: true, tags: [] };
  imagePreview: string | ArrayBuffer | null = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  tagsString = ''; // For form input

  constructor(private router: Router, private blogApiService: BlogApiService, private blogRefreshService: BlogRefreshService) {}

  ngOnInit() {
    // Initialize component - no blog loading needed on this page
  }

  addBlog() {
    if (!this.newBlog.title || !this.newBlog.description) {
      this.errorMessage = 'Please fill all required fields.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Convert image preview to string if needed and handle tags
    const processedTags = this.tagsString ? this.tagsString.split(',').map((tag: string) => tag.trim()).filter(tag => tag.length > 0) : [];
    
    const blogData: CreateBlogRequest = {
      title: this.newBlog.title,
      description: this.newBlog.description || undefined,
      subtitle: this.newBlog.subtitle || undefined,
      author: this.newBlog.author || undefined,
      image: typeof this.imagePreview === 'string' ? this.imagePreview : undefined,
      tags: processedTags.length > 0 ? processedTags : undefined,
      published: this.newBlog.published
    };

    console.log('[FRONTEND] Sending blog data:', blogData);

    this.blogApiService.createBlog(blogData).subscribe({
      next: (createdBlog) => {
        this.successMessage = `Blog "${this.newBlog.title}" added successfully! It will appear on the homepage in 2 seconds...`;
        this.isLoading = false;
        
        // Automatically redirect to homepage after 2 seconds to show the new blog
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      },
      error: (error) => {
        this.errorMessage = 'Failed to add blog. Please try again.';
        this.isLoading = false;
        console.error('Error adding blog:', error);
      }
    });
  }

  resetForm() {
    this.newBlog = { title: '', description: '', content: '', published: true, tags: [] };
    this.imagePreview = '';
    this.tagsString = '';
    this.errorMessage = '';
    this.successMessage = '';
  }

  onImageUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Check file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        this.errorMessage = 'Image size must be less than 5MB';
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Please select a valid image file';
        return;
      }

      // Compress image
      this.compressImage(file, 0.8, 800, 600).then(compressedDataUrl => {
        this.imagePreview = compressedDataUrl;
        this.errorMessage = ''; // Clear any previous error
      }).catch(error => {
        console.error('Image compression failed:', error);
        // Fallback to original image
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result;
          this.errorMessage = '';
        };
        reader.readAsDataURL(file);
      });
    }
  }

  compressImage(file: File, quality: number, maxWidth: number, maxHeight: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width *= ratio;
            height *= ratio;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to data URL with compression
          canvas.toBlob((blob) => {
            if (blob) {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = () => reject(new Error('Failed to read compressed image'));
              reader.readAsDataURL(blob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          }, 'image/jpeg', quality);
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = event.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  // Helper method for form scrolling
  scrollToForm(): void {
    const formElement = document.querySelector('.add-blog-section');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
