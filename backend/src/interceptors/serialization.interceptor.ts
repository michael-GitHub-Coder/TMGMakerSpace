import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SerializationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // If it's an array, serialize each item
        if (Array.isArray(data)) {
          return data.map(item => this.serializeBlog(item));
        }
        // If it's a single object, serialize it
        return this.serializeBlog(data);
      }),
    );
  }

  private serializeBlog(blog: any): any {
    if (!blog) return blog;
    
    return {
      ...blog,
      createdAt: blog.createdAt ? blog.createdAt.toISOString() : undefined,
      updatedAt: blog.updatedAt ? blog.updatedAt.toISOString() : undefined,
    };
  }
}
