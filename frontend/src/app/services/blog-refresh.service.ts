import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Blog } from './blog-api.service';

@Injectable({
  providedIn: 'root'
})
export class BlogRefreshService {
  // Subject to emit when a new blog is created
  private blogCreatedSubject = new Subject<Blog>();
  
  // Subject to emit when blogs need to be refreshed
  private refreshBlogsSubject = new Subject<void>();
  
  // Observable for components to subscribe to
  blogCreated$ = this.blogCreatedSubject.asObservable();
  refreshBlogs$ = this.refreshBlogsSubject.asObservable();
  
  constructor() {}
  
  // Call this method when a new blog is created
  notifyBlogCreated(blog: Blog): void {
    console.log('[BLOG REFRESH SERVICE] New blog created:', blog.title);
    this.blogCreatedSubject.next(blog);
    // Also trigger a general refresh
    this.refreshBlogsSubject.next();
  }
  
  // Call this method to trigger a refresh of all blogs
  triggerRefresh(): void {
    console.log('[BLOG REFRESH SERVICE] Triggering blog refresh...');
    this.refreshBlogsSubject.next();
  }
}
