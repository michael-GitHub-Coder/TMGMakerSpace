import { Component } from '@angular/core';
import { HeaderComponent } from '../../../../shared/header/header';
import { FooterComponent } from '../../../../shared/footer/footer';
import { BannerComponent } from '../../../../shared/banner/banner';

@Component({
  selector: 'app-about',
  templateUrl: './about.html',
  imports: [ HeaderComponent, FooterComponent,BannerComponent],
})
export class AboutComponent {

}
