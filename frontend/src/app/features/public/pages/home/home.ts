import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { HeaderComponent } from '../../../../shared/header/header';
import { FooterComponent } from '../../../../shared/footer/footer';
import { BlogApiService, Blog } from '../../../../services/blog-api.service';
import { BlogRefreshService } from '../../../../services/blog-refresh.service';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  imports: [CommonModule, RouterModule, CarouselModule, HeaderComponent, FooterComponent],
})
export class HomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  logos: string[] = [
    './images/patners/Wits-University-Logo.jpeg',
    './images/patners/City_of_Johannesburg_logo.png',
    './images/patners/ARM-Logo.png',
    './images/patners/JP-Morgan-Chase-Logo.png',
    './images/patners/Gauteng-E_Government-Logo.png',
    './images/patners/Sibanye-Stillwater-Logo.png',
    './images/patners/Liberty-Logo.jpg',
    './images/patners/SWGT-Logo.png',
    './images/patners/GoetheInstitut-logo.png',
    './images/patners/Royal-Bafokeng-Nation.jpg',
    './images/patners/PWC-Logo.png',
    './images/patners/Wits-Business-School-Logo.png',
    './images/patners/GIZ-Logo.jpg',
    './images/patners/ABB-Logo.jpg',
    './images/patners/Accenture-logo.png',
    './images/patners/Henley-Business-School-Logo.jpg',
    './images/patners/Redbull-Basement-Logo.png',
    './images/patners/Siemens-Logo.jpg',
    './images/patners/Bryte-Logo.jpg',
    './images/patners/UNDP-Logo.png',
  ];

  // Split into 5 columns (4 logos per column)
  columns: string[][] = [];
  latestBlogs: Blog[] = [];
  blogsLoading = false;
  blogsError = '';

  constructor(private blogApiService: BlogApiService, private router: Router, private blogRefreshService: BlogRefreshService) {}

  ngOnInit(): void {
    this.columns = this.createColumns(this.logos, 4); // 4 logos per column
    // Load blogs immediately
    this.loadLatestBlogs();
    
    // Listen for blog refresh events (when new blogs are created)
    this.blogRefreshService.refreshBlogs$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      console.log('[HOME COMPONENT] Blog refresh event received, reloading blogs...');
      this.loadLatestBlogs();
    });
    
    // Listen for router events to refresh blogs when returning to homepage
    this.router.events.pipe(
      takeUntil(this.destroy$),
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (event.urlAfterRedirects === '/' || event.urlAfterRedirects === '/home') {
        // Add small delay to prevent rapid successive calls
        setTimeout(() => {
          this.loadLatestBlogs();
        }, 500);
      }
    });
  }

  refreshBlogs(): void {
    console.log('Manually refreshing blogs...');
    // Clear current data first
    this.latestBlogs = [];
    this.blogsError = '';
    this.loadLatestBlogs();
  }

  forceRefreshBlogs(): void {
    console.log('Force refreshing blogs - clearing all cache...');
    // Clear all data and reload
    this.latestBlogs = [];
    this.blogsError = '';
    this.blogsLoading = false;
    
    // Small delay to ensure clear
    setTimeout(() => {
      this.loadLatestBlogs();
    }, 100);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadLatestBlogs(): void {
    console.log('Starting to load latest blogs...');
    this.blogsLoading = true;
    this.blogsError = '';
    this.blogApiService.getLatestBlogs(3).subscribe({
      next: (blogs: Blog[]) => {
        console.log('Successfully loaded blogs:', blogs);
        console.log('Number of blogs:', blogs.length);
        console.log('First blog:', blogs[0]);
        this.latestBlogs = blogs;
        this.blogsLoading = false;
      },
      error: (error) => {
        console.error('Error loading latest blogs:', error);
        this.blogsError = 'Failed to load latest blogs';
        this.blogsLoading = false;
      }
    });
  }

  createColumns(arr: string[], perCol: number): string[][] {
    const cols: string[][] = [];
    for (let i = 0; i < arr.length; i += perCol) {
      cols.push(arr.slice(i, i + perCol));
    }
    return cols;
  }

  // Owl Carousel options - optimized for performance
  carouselOptions: OwlOptions = {
    loop: true,
    margin: 15,              // Reduced margin
    autoplay: false,           // Disabled for better performance
    autoplayTimeout: 4000,    // Slower timeout if enabled
    autoplayHoverPause: true,
    dots: false,
    nav: true,
    navText: ['<', '>'],
    responsive: {
      0: { items: 1 },
      768: { items: 2 },
      1200: { items: 5 }, // show 5 columns at full width
    },
    lazyLoad: true,          // Enable lazy loading
    lazyLoadEager: 0,        // Load current and next items
    mouseDrag: true,          // Enable touch/drag
    touchDrag: true,
    pullDrag: false,          // Disable pull drag for better performance
    freeDrag: false,          // Disable free drag for better performance
    stagePadding: 0,          // No padding for cleaner look
    merge: false,             // No merging for better performance
    autoWidth: false,          // Fixed width for better control
  };
}
