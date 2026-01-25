import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../../shared/header/header';
import { FooterComponent } from '../../../../shared/footer/footer';
import { BannerComponent } from '../../../../shared/banner/banner';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, BannerComponent, CarouselModule],
  templateUrl: './blog.html',
})
export class BlogComponent {
  blogs = [
    {
      image: './images/Homepage 5.jpg',
      title: 'The Rise of Robotics in Africa',
      subtitle: 'How robotics is transforming manufacturing and education.',
      date: '2025-09-18',
      time: '10:00 AM',
    },
    {
      image: './images/Homepage 4.jpg',
      title: '3D Printing: The Future of Prototyping',
      subtitle: 'Why startups are adopting 3D printing for fast and affordable prototyping.',
      date: '2025-09-15',
      time: '02:30 PM',
    },
    {
      image: './images/Homepage 5.jpg',
      title: 'AI in Everyday Life',
      subtitle: 'Exploring practical AI applications in small businesses.',
      date: '2025-09-10',
      time: '09:00 AM',
    },
  ];

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
