import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-banner',
  standalone: true,
  templateUrl: './banner.html',
  imports: [RouterModule],
})
export class BannerComponent {
  @Input() heading: string = '';
  @Input() route: string = '/';
  @Input() routeLabel: string = '';
}