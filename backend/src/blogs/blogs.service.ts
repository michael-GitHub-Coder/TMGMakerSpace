import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogEntity } from './blog.entity';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(BlogEntity)
    private readonly blogRepository: Repository<BlogEntity>,
  ) {}

  async createBlog(createBlogDto: CreateBlogDto): Promise<BlogEntity> {
    try {
      const blog = this.blogRepository.create(createBlogDto);
      
      if (blog.published && !blog.publishedAt) {
        blog.publishedAt = new Date();
      }
      
      return await this.blogRepository.save(blog);
    } catch (error) {
      throw new BadRequestException('Failed to create blog post');
    }
  }

  async getAllBlogs(): Promise<BlogEntity[]> {
    try {
      return await this.blogRepository.find({
        where: { published: true },
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      throw new NotFoundException('Failed to retrieve blog posts');
    }
  }

  async getBlogById(id: string): Promise<BlogEntity> {
    try {
      const blog = await this.blogRepository.findOne({ where: { id } });
      
      if (!blog) {
        throw new NotFoundException(`Blog post with ID ${id} not found`);
      }
      
      return blog;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to retrieve blog post');
    }
  }

  async getAllBlogsAdmin(): Promise<BlogEntity[]> {
    try {
      return await this.blogRepository.find({
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      throw new NotFoundException('Failed to retrieve blog posts');
    }
  }

  async updateBlog(id: string, updateBlogDto: UpdateBlogDto): Promise<BlogEntity> {
    try {
      const blog = await this.getBlogById(id);
      
      Object.assign(blog, updateBlogDto);
      
      if (blog.published && !blog.publishedAt) {
        blog.publishedAt = new Date();
      }
      
      return await this.blogRepository.save(blog);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update blog post');
    }
  }

  async deleteBlog(id: string): Promise<void> {
    try {
      const result = await this.blogRepository.delete(id);
      
      if (result.affected === 0) {
        throw new NotFoundException(`Blog post with ID ${id} not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete blog post');
    }
  }

  async publishBlog(id: string): Promise<BlogEntity> {
    try {
      const blog = await this.getBlogById(id);
      
      blog.published = true;
      blog.publishedAt = new Date();
      
      return await this.blogRepository.save(blog);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to publish blog post');
    }
  }

  async unpublishBlog(id: string): Promise<BlogEntity> {
    try {
      const blog = await this.getBlogById(id);
      
      blog.published = false;
      blog.publishedAt = null;
      
      return await this.blogRepository.save(blog);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to unpublish blog post');
    }
  }
}

export class CreateBlogDto {
  title: string;
  content: string;
  author?: string;
  summary?: string;
  imageUrl?: string;
  category?: string;
  tags?: string[];
  published?: boolean;
}

export class UpdateBlogDto {
  title?: string;
  content?: string;
  author?: string;
  summary?: string;
  imageUrl?: string;
  category?: string;
  tags?: string[];
  published?: boolean;
}
