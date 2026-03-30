import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BlogsService, CreateBlogDto, UpdateBlogDto } from './blogs.service';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getPublishedBlogs() {
    return await this.blogsService.getAllBlogs();
  }

  @Get('admin/all')
  @HttpCode(HttpStatus.OK)
  async getAllBlogs() {
    return await this.blogsService.getAllBlogsAdmin();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getBlogById(@Param('id') id: string) {
    return await this.blogsService.getBlogById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBlog(@Body() createBlogDto: CreateBlogDto) {
    return await this.blogsService.createBlog(createBlogDto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateBlog(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return await this.blogsService.updateBlog(id, updateBlogDto);
  }

  @Patch(':id/publish')
  @HttpCode(HttpStatus.OK)
  async publishBlog(@Param('id') id: string) {
    return await this.blogsService.publishBlog(id);
  }

  @Patch(':id/unpublish')
  @HttpCode(HttpStatus.OK)
  async unpublishBlog(@Param('id') id: string) {
    return await this.blogsService.unpublishBlog(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(@Param('id') id: string) {
    await this.blogsService.deleteBlog(id);
  }
}
