import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../../../shared/header/header';
import { FooterComponent } from '../../../../shared/footer/footer';
import { BlogApiService, Blog } from '../../../../services/blog-api.service';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  templateUrl: './blog-detail.html',
  styleUrls: ['./blog-detail.css'],
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent]
})
export class BlogDetailComponent implements OnInit {
  blog: Blog | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogApiService: BlogApiService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadBlog(Number(id));
    } else {
      this.errorMessage = 'Blog post not found';
    }
  }

  loadBlog(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.blogApiService.getBlogById(id).subscribe({
      next: (blog: Blog) => {
        this.blog = blog;
        this.isLoading = false;
        console.log('Blog loaded successfully:', blog);
      },
      error: (error) => {
        this.errorMessage = 'Failed to load blog post';
        this.isLoading = false;
        console.error('Error loading blog:', error);
      }
    });
  }

  getBlogContent(): string {
    if (!this.blog) return '';
    
    // If there's full content, use it
    if (this.blog.content && this.blog.content.trim()) {
      return this.blog.content;
    }
    
    // If no full content, use description as fallback
    if (this.blog.description) {
      return `<p>${this.blog.description}</p>`;
    }
    
    return '<p>No content available for this blog post.</p>';
  }

  goBack(): void {
    this.router.navigate(['/blog']);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getReadingTime(): number {
    if (!this.blog) return 0;
    
    const content = this.getBlogContent();
    const wordsPerMinute = 200; // Average reading speed
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    
    return Math.ceil(wordCount / wordsPerMinute);
  }

  shareOnTwitter(): void {
    if (!this.blog) return;
    
    const text = encodeURIComponent(`Check out this article: ${this.blog.title}`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  }

  shareOnFacebook(): void {
    if (!this.blog) return;
    
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  }

  shareOnLinkedIn(): void {
    if (!this.blog) return;
    
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(this.blog.title);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}`, '_blank');
  }

  copyLink(): void {
    navigator.clipboard.writeText(window.location.href).then(() => {
      // Show a toast or notification that link was copied
      this.showCopyNotification();
    });
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  showCopyNotification(): void {
    // Create a simple notification
    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.textContent = 'Link copied to clipboard!';
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #28a745;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
}
