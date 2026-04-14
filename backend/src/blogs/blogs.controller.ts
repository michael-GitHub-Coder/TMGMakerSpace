import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Controller('api/blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  create(@Body(ValidationPipe) createBlogDto: CreateBlogDto) {
    console.log('[BLOGS CONTROLLER] Received blog creation request:', createBlogDto);
    return this.blogsService.create(createBlogDto);
  }

  @Get()
  findAll() {
    return this.blogsService.findAll();
  }

  @Get('admin/all')
  findAllAdmin() {
    return this.blogsService.findAllAdmin();
  }

  @Get('latest')
  getLatestBlogs(@Query('limit') limit?: string) {
    const blogLimit = limit ? parseInt(limit, 10) : 3;
    return this.blogsService.getLatestBlogs(blogLimit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body(ValidationPipe) updateBlogDto: UpdateBlogDto) {
    return this.blogsService.update(+id, updateBlogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogsService.remove(+id);
  }
}
