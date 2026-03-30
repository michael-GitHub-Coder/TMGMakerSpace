import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { provideAnimations } from '@angular/platform-browser/animations';

import { register } from 'swiper/element/bundle';
// Register Swiper custom elements
register();

// Bootstrap the application with appConfig and animations
bootstrapApplication(App, {
  providers: [
    ...appConfig.providers,  // Include all providers from appConfig (HttpClient, Router, etc.)
    provideAnimations()      // Add animations for ngx-owl-carousel-o
  ]
})
  .then(() => {
    // Initialize AOS animations with optimized settings
    AOS.init({ 
      duration: 800,           // Faster animations
      once: true,             // Only animate once
      offset: 100,            // Start animation earlier
      throttleDelay: 50,      // Reduce throttle delay
      disable: 'mobile'        // Disable on mobile for better performance
    });
  })
  .catch(err => console.error('Bootstrap error:', err));