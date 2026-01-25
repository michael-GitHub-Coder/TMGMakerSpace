import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { HeaderComponent } from '../../../../shared/header/header';
import { FooterComponent } from '../../../../shared/footer/footer';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  imports: [CommonModule, RouterModule, CarouselModule, HeaderComponent, FooterComponent],
})
export class HomeComponent implements OnInit {
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

  ngOnInit(): void {
    this.columns = this.createColumns(this.logos, 4); // 4 logos per column
  }

  createColumns(arr: string[], perCol: number): string[][] {
    const cols: string[][] = [];
    for (let i = 0; i < arr.length; i += perCol) {
      cols.push(arr.slice(i, i + perCol));
    }
    return cols;
  }

  // Owl Carousel options
  carouselOptions: OwlOptions = {
    loop: true,
    margin: 20,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    dots: false,
    nav: true,
    navText: ['<', '>'],
    responsive: {
      0: { items: 1 },
      768: { items: 2 },
      1200: { items: 5 }, // show 5 columns at full width
    },
  };
}
