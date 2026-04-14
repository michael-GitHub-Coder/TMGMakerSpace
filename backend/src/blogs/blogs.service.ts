import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
  ) {}

  async create(createBlogDto: CreateBlogDto): Promise<Blog> {
    try {
      console.log('[BLOGS SERVICE] Creating blog with DTO:', createBlogDto);
      const blog = this.blogRepository.create(createBlogDto);
      const result = await this.blogRepository.save(blog);
      console.log('[BLOGS SERVICE] Blog created successfully:', result);
      return result;
    } catch (error) {
      console.error('[BLOGS SERVICE] Error creating blog:', error);
      throw new InternalServerErrorException('Failed to create blog post');
    }
  }

  async findAll(): Promise<Blog[]> {
    try {
      return await this.blogRepository.find({
        where: { published: true },
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch blog posts');
    }
  }

  async findAllAdmin(): Promise<Blog[]> {
    try {
      return await this.blogRepository.find({
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch blog posts');
    }
  }

  async findOne(id: number): Promise<Blog> {
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
      throw new InternalServerErrorException('Failed to fetch blog post');
    }
  }

  async update(id: number, updateBlogDto: UpdateBlogDto): Promise<Blog> {
    try {
      const blog = await this.findOne(id);
      Object.assign(blog, updateBlogDto);
      return await this.blogRepository.save(blog);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update blog post');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.blogRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Blog post with ID ${id} not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete blog post');
    }
  }

  async getLatestBlogs(limit: number = 3): Promise<Blog[]> {
    try {
      return await this.blogRepository.find({
        where: { published: true },
        order: { createdAt: 'DESC' },
        take: limit,
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch latest blog posts');
    }
  }
}
