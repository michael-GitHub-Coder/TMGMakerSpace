import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-partners-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './partners-carousel.html'

})
export class PartnersCarouselComponent {
  partners = [
    ['Wits-University-Logo.jpeg','City_of_Johannesburg_logo.png','ARM-Logo.png','JP-Morgan-Chase-Logo.png'],
    ['University-of-Johaneesburg-Logo.png','Gauteng-E_Government-Logo.png','Sibanye-Stillwater-Logo.png','Liberty-Logo.jpg'],
    ['SWGT-Logo.png','GoetheInstitut-logo.png','Royal-Bafokeng-Nation.jpg','PWC-Logo.png'],
    ['Wits-Business-School-Logo.png','GIZ-Logo.jpg','ABB-Logo.jpg','Accenture-Logo.png'],
    ['Henley-Business-School-Logo.jpg','UNDP-Logo.png','BCX-Logo.png','Unilever-Logo.jpg'],
    ['Redbull-Basement-Logo.png','tshimologong_logo.png','Siemens-Logo.jpg','Bryte-Logo.jpg']
  ];

  currentSlide = 0;

  constructor() {
    setInterval(() => this.nextSlide(), 3000);
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.partners.length;
  }
}
