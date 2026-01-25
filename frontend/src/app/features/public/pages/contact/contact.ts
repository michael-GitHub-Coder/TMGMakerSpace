import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../../shared/header/header';
import { FooterComponent } from '../../../../shared/footer/footer'; 
import { BannerComponent } from '../../../../shared/banner/banner';
import AOS from 'aos';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, BannerComponent],
  templateUrl: './contact.html',
})
export class ContactComponent implements AfterViewInit {

  constructor() { }

  ngAfterViewInit(): void {
    AOS.refresh(); // refresh animations after view init
  }
}
