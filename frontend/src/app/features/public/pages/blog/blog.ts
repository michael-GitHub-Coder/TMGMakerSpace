import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../../shared/header/header';
import { FooterComponent } from '../../../../shared/footer/footer';
import { BannerComponent } from '../../../../shared/banner/banner';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { BlogApiService, Blog } from '../../../../services/blog-api.service';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, BannerComponent, CarouselModule, RouterModule],
  templateUrl: './blog.html',
  styleUrl: './blog.css'
})
export class BlogComponent implements OnInit {
  blogs: Blog[] = [];
  isLoading = false;
  error = '';

  constructor(private blogApiService: BlogApiService) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.isLoading = true;
    this.error = '';
    this.blogApiService.getAllBlogs().subscribe({
      next: (blogs: Blog[]) => {
        this.blogs = blogs;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load blogs';
        this.isLoading = false;
        console.error('Error loading blogs:', error);
      }
    });
  }

  blogOptions: OwlOptions = {
    loop: true,
    margin: 20,
    nav: true,
    dots: false,
    autoplay: true,
    autoplayTimeout: 4000,
    autoplayHoverPause: true,
    navText: ['<', '>'],
    responsive: {
      0: { items: 1 },
      576: { items: 1 },
      768: { items: 2 },
      992: { items: 3 },
    },
  };
}
