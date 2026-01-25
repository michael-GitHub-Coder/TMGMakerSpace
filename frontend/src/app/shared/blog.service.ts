import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Blog {
  title: string;
  image: string;
  author: string;
  content: string;
  tags: string[];
}

@Injectable({ providedIn: 'root' })
export class BlogService {
  private blogsSource = new BehaviorSubject<Blog[]>([]);
  blogs$ = this.blogsSource.asObservable();

  getBlogs(): Blog[] {
    return this.blogsSource.getValue();
  }

  addBlog(blog: Blog) {
    const updated = [...this.blogsSource.getValue(), blog];
    this.blogsSource.next(updated);
  }

  removeBlog(index: number) {
    const updated = this.blogsSource.getValue();
    updated.splice(index, 1);
    this.blogsSource.next([...updated]);
  }
}
