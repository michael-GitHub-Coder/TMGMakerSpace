import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MarketplaceService, MarketplaceItem, Enquiry } from '../../../../services/marketplace.service';
import { HeaderComponent } from '../../../../shared/header/header';
import { FooterComponent } from '../../../../shared/footer/footer';
import { BannerComponent } from '../../../../shared/banner/banner';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent, BannerComponent, CarouselModule],
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.css']
})
export class MarketplaceComponent implements OnInit {
  marketplaceItems: MarketplaceItem[] = [];
  loading = false;
  error = '';
  success = '';
  
  // Enquiry form
  showEnquiryForm = false;
  selectedItem: MarketplaceItem | null = null;
  enquiryForm = {
    user_name: '',
    user_email: '',
    user_phone: '',
    enquiryMessage: ''
  };

  constructor(private marketplaceService: MarketplaceService) {}

  ngOnInit(): void {
    this.loadMarketplaceItems();
    // Scroll to content area (account for nav/header)
    this.scrollToContent();
  }

  // Carousel options like blog component
  marketplaceOptions: OwlOptions = {
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

  // Scroll to content area (account for nav/header) - like blog page
  scrollToContent(): void {
    setTimeout(() => {
      // Like blog page, scroll to top - banner and header will be visible
      console.log('🚀 MARKETPLACE: Scrolling to top like blog page');
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, 100);
  }

  loadMarketplaceItems(): void {
    this.loading = true;
    console.log('🚀 MARKETPLACE: 🔄 Loading from REAL DATABASE at http://localhost:3000/api/marketplace/items');
    
    this.marketplaceService.getMarketplaceItems().subscribe({
      next: (items) => {
        console.log('🚀 MARKETPLACE: 📊 Raw data from database:', items);
        console.log('🚀 MARKETPLACE: 📈 Total items received:', items.length);
        
        this.marketplaceItems = items.filter(item => item.isActive);
        console.log('🚀 MARKETPLACE: ✅ Active items filtered:', this.marketplaceItems.length);
        console.log('🚀 MARKETPLACE: 📋 Active items:', this.marketplaceItems);
        
        // Verify database connection
        if (items.length > 0) {
          console.log('🚀 MARKETPLACE: ✅ CONNECTED TO REAL DATABASE - Found items');
          console.log('🚀 MARKETPLACE: 🏷️ Sample item:', items[0]);
        } else {
          console.log('🚀 MARKETPLACE: ⚠️ Database connected but no items found');
        }
        
        // DEBUG IMAGE PATHS - Check what's actually stored
        this.marketplaceItems.forEach((item, index) => {
          console.log(`🚀 MARKETPLACE: 🖼️ ITEM ${index + 1} IMAGE DEBUG:`, {
            title: item.title,
            imagePath: item.image,
            hasImage: !!item.image,
            imageType: typeof item.image,
            imageValue: JSON.stringify(item.image),
            imagePathLength: item.image ? item.image.length : 0,
            imagePathTrimmed: item.image ? item.image.trim() : 'null'
          });
          
          // Test if the image path is valid
          if (item.image && item.image.trim().length > 0) {
            const testUrl = `http://localhost:3000/${item.image}`;
            console.log(`🚀 MARKETPLACE: 🧪 Testing image URL: ${testUrl}`);
            this.testImageUrl(testUrl);
          } else {
            console.log(`🚀 MARKETPLACE: ❌ Item ${index + 1} has no valid image path - will show default`);
          }
        });
        
        this.loading = false;
      },
      error: (err) => {
        console.error('🚀 MARKETPLACE: ❌ ERROR connecting to REAL DATABASE:', err);
        console.error('🚀 MARKETPLACE: 🔗 Failed URL: http://localhost:3000/api/marketplace/items');
        this.error = 'Failed to load marketplace items from database';
        this.loading = false;
      }
    });
  }

  // Helper method to construct full image URL - REAL IMAGES ONLY
  getFullImageUrl(imagePath: string | undefined): string {
    console.log('🚀 MARKETPLACE: Processing REAL image path:', imagePath);
    
    if (!imagePath) {
      console.log('🚀 MARKETPLACE: ❌ No real image path - NO PLACEHOLDER');
      return ''; // Return empty - no placeholder images
    }
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) {
      console.log('🚀 MARKETPLACE: ✅ Real full URL detected:', imagePath);
      return imagePath;
    }
    
    // Backend stores images as "uploads/marketplace/filename.png" and serves them at "/uploads/marketplace/filename.png"
    // So we need to use the exact path that's stored in the database
    const url = `http://localhost:3000/${imagePath}`;
    console.log('🚀 MARKETPLACE: Using REAL URL pattern:', url);
    return url;
  }

  // Handle image loading errors - NO MOCK IMAGES
  handleImageError(event: any): void {
    console.log('🚀 MARKETPLACE: ❌ REAL IMAGE FAILED TO LOAD - HIDING:', event.target.src);
    
    // Hide the image if it fails to load (no fallback URLs needed since we use the correct pattern)
    const img = event.target;
    img.style.display = 'none';
    
    const imageContainer = img.closest('.item-image');
    if (imageContainer) {
      imageContainer.style.display = 'none';
    }
    
    console.log('🚀 MARKETPLACE: 🚫 Image hidden due to loading error');
  }

  // Handle successful image loading
  handleImageLoad(event: any): void {
    console.log('🚀 MARKETPLACE: Image loaded successfully:', event.target.src);
  }

  // Test if image URL is accessible
  testImageUrl(url: string): void {
    console.log('🚀 MARKETPLACE: Testing image URL accessibility:', url);
    
    // Create a test image element to check if URL loads
    const testImg = new Image();
    testImg.onload = () => {
      console.log('🚀 MARKETPLACE: ✅ Image URL is accessible:', url);
    };
    testImg.onerror = () => {
      console.log('🚀 MARKETPLACE: ❌ Image URL is NOT accessible:', url);
    };
    testImg.src = url;
  }

  // Proactively find and test REAL necklace image URLs - NO MOCK IMAGES
  findNecklaceImage(item: MarketplaceItem): string {
    if (!item.title || !item.title.toLowerCase().includes('necklace')) {
      return this.getFullImageUrl(item.image);
    }
    
    console.log('🚀 MARKETPLACE: 📿 PROACTIVE REAL NECKLACE IMAGE SEARCH - NO MOCKS');
    
    // Use the correct URL pattern that matches backend static serving
    const url = this.getFullImageUrl(item.image);
    console.log('🚀 MARKETPLACE: 📿 Using REAL necklace URL:', url);
    this.testImageUrl(url);
    return url;
  }

  // Get marketplace image URL - ONLY member uploads allowed
  getMarketplaceImageUrl(imagePath: string | undefined): string {
    console.log('🚀 MARKETPLACE: 🖼️ Getting marketplace image URL for:', imagePath);
    
    // If no image path, return empty - NO DEFAULT IMAGES
    if (!imagePath || imagePath.trim() === '') {
      console.log('🚀 MARKETPLACE: ❌ No image path - NO DEFAULT IMAGES ALLOWED');
      return ''; // Return empty - no placeholder images
    }
    
    console.log('🚀 MARKETPLACE: 📸 Using member uploaded image URL for:', imagePath);
    return `http://localhost:3000/${imagePath}`;
  }

  // Format cost safely - handle different data types
  formatCost(cost: any): string {
    if (cost === null || cost === undefined) {
      return '0.00';
    }
    
    // Convert to number if it's a string
    const numCost = typeof cost === 'string' ? parseFloat(cost) : Number(cost);
    
    // Check if it's a valid number
    if (isNaN(numCost)) {
      return '0.00';
    }
    
    return numCost.toFixed(2);
  }

  openEnquiryForm(item: MarketplaceItem): void {
    this.selectedItem = item;
    this.showEnquiryForm = true;
    this.resetEnquiryForm();
  }

  closeEnquiryForm(): void {
    this.showEnquiryForm = false;
    this.selectedItem = null;
    this.resetEnquiryForm();
  }

  resetEnquiryForm(): void {
    this.enquiryForm = {
      user_name: '',
      user_email: '',
      user_phone: '',
      enquiryMessage: ''
    };
    this.error = '';
    this.success = '';
  }

  submitEnquiry(): void {
    if (!this.selectedItem) return;
    
    if (!this.enquiryForm.user_name || !this.enquiryForm.user_email || !this.enquiryForm.enquiryMessage) {
      this.error = 'Please fill in all required fields';
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.enquiryForm.user_email)) {
      this.error = 'Please enter a valid email address';
      return;
    }

    const enquiry: Omit<Enquiry, 'createdAt'> = {
      itemId: this.selectedItem.id || '',
      itemName: this.selectedItem.title,
      memberEmail: this.selectedItem.memberEmail,
      memberName: this.selectedItem.memberName,
      enquiryMessage: this.enquiryForm.enquiryMessage,
      user_name: this.enquiryForm.user_name,
      user_email: this.enquiryForm.user_email,
      user_phone: this.enquiryForm.user_phone
    };

    this.loading = true;

    this.marketplaceService.sendEnquiry(enquiry).subscribe({
      next: (response) => {
        this.loading = false;
        this.showSuccessModal();
      },
      error: (err) => {
        console.error('Error sending enquiry:', err);
        this.error = 'Failed to send enquiry. Please try again later.';
        this.loading = false;
      }
    });
  }

  showSuccessModal(): void {
    // Close the enquiry form first
    this.closeEnquiryForm();
    
    // Set success message for display
    this.success = `Your enquiry has been sent successfully to ${this.selectedItem?.memberName}! They will contact you soon.`;
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      this.success = '';
    }, 5000);
  }
}
