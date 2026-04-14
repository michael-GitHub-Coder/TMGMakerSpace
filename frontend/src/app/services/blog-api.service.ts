import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { BlogRefreshService } from './blog-refresh.service';

export interface Blog {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  author?: string;
  tags?: string[];
  content?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogRequest {
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  author?: string;
  tags?: string[];
  content?: string;
  published?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BlogApiService {
  private readonly apiUrl = 'http://localhost:3000/api/blogs';

  constructor(private http: HttpClient, private blogRefreshService: BlogRefreshService) {}

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    
    console.error('Full HTTP Error Details:', {
      status: error.status,
      statusText: error.statusText,
      url: error.url,
      message: error.message,
      error: error.error
    });
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client error: ${error.error.message}`;
    } else if (error.status === 0) {
      errorMessage = 'Network error - Unable to connect to backend';
    } else {
      errorMessage = `Server error: ${error.status} - ${error.message}`;
    }
    
    console.error('Blog API Error:', errorMessage);
    return throwError(() => errorMessage);
  }

  createBlog(blog: CreateBlogRequest): Observable<Blog> {
    return this.http.post<Blog>(this.apiUrl, blog).pipe(
      tap(createdBlog => {
        // Notify the refresh service that a new blog was created
        this.blogRefreshService.notifyBlogCreated(createdBlog);
      }),
      catchError(this.handleError)
    );
  }

  getAllBlogs(): Observable<Blog[]> {
    // Add timestamp to prevent caching
    const timestamp = Date.now();
    return this.http.get<Blog[]>(`${this.apiUrl}?_t=${timestamp}`).pipe(
      catchError(this.handleError)
    );
  }

  getLatestBlogs(limit: number = 3): Observable<Blog[]> {
    // Add timestamp to prevent caching
    const timestamp = Date.now();
    return this.http.get<Blog[]>(`${this.apiUrl}/latest?limit=${limit}&_t=${timestamp}`).pipe(
      catchError(this.handleError)
    );
  }

  getBlogById(id: number): Observable<Blog> {
    return this.http.get<Blog>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  updateBlog(id: number, blog: Partial<CreateBlogRequest>): Observable<Blog> {
    return this.http.patch<Blog>(`${this.apiUrl}/${id}`, blog).pipe(
      catchError(this.handleError)
    );
  }

  deleteBlog(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getAllBlogsAdmin(): Observable<Blog[]> {
    return this.http.get<Blog[]>(`${this.apiUrl}/admin/all`).pipe(
      catchError(this.handleError)
    );
  }
}
