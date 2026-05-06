import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MarketplaceService, MarketplaceItem } from '../../../../services/marketplace.service';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-marketplace-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './marketplace-manager.component.html',
  styleUrls: ['./marketplace-manager.component.css']
})
export class MarketplaceManagerComponent implements OnInit {
  marketplaceItems: MarketplaceItem[] = [];
  loading = false;
  error = '';
  success = '';
  
  // Form variables
  showForm = false;
  editingItem: MarketplaceItem | null = null;
  formData: Partial<MarketplaceItem> = {
    title: '',
    description: '',
    cost: 0,
    image: '',
    isActive: true
  };
  
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  uploading = false;

  constructor(
    private marketplaceService: MarketplaceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadMemberItems();
  }

  get currentUser() {
    return this.authService.getCurrentUser();
  }

  loadMemberItems(): void {
    console.log('🚀 MARKETPLACE MANAGER: 🔄 LOADING MEMBER ITEMS');
    this.loading = true;
    const memberEmail = this.currentUser?.email;
    
    if (!memberEmail) {
      console.error('🚀 MARKETPLACE MANAGER: ❌ User email not found');
      this.error = 'User email not found';
      this.loading = false;
      return;
    }

    console.log('🚀 MARKETPLACE MANAGER: 👤 Loading items for:', memberEmail);

    this.marketplaceService.getMemberMarketplaceItems(memberEmail).subscribe({
      next: (items) => {
        console.log('🚀 MARKETPLACE MANAGER: ✅ ITEMS LOADED:', items);
        this.marketplaceItems = items;
        
        // Debug image URLs for each item
        items.forEach((item, index) => {
          console.log(`🚀 MARKETPLACE MANAGER: 🖼️ Item ${index + 1} Image Debug:`, {
            title: item.title,
            imagePath: item.image,
            hasImage: !!item.image,
            imageType: typeof item.image,
            fullUrl: item.image ? `http://localhost:3000/${item.image}` : 'No image'
          });
          
          // Test image accessibility
          if (item.image) {
            this.testImageAccessibility(item.image, index + 1);
          }
        });
        
        this.loading = false;
      },
      error: (err) => {
        console.error('🚀 MARKETPLACE MANAGER: ❌ ERROR LOADING ITEMS:', err);
        this.error = 'Failed to load marketplace items';
        this.loading = false;
      }
    });
  }

  // Test if image URL is accessible
  testImageAccessibility(imagePath: string, itemIndex: number): void {
    const testUrls = [
      `http://localhost:3000/${imagePath}`,
      `http://localhost:3000/uploads/${imagePath}`,
      `http://localhost:3000/marketplace/${imagePath}`,
      `http://localhost:3000/images/${imagePath}`,
    ];

    console.log(`🚀 MARKETPLACE MANAGER: 🧪 Testing image ${itemIndex} accessibility`);

    testUrls.forEach((url, index) => {
      const testImg = new Image();
      testImg.onload = () => {
        console.log(`🚀 MARKETPLACE MANAGER: ✅ Image ${itemIndex} - URL ${index + 1} WORKS:`, url);
      };
      testImg.onerror = () => {
        console.log(`🚀 MARKETPLACE MANAGER: ❌ Image ${itemIndex} - URL ${index + 1} FAILED:`, url);
      };
      testImg.src = url;
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.formData = {
      title: '',
      description: '',
      cost: 0,
      image: '',
      isActive: true
    };
    this.editingItem = null;
    this.selectedFile = null;
    this.imagePreview = null;
    this.error = '';
    this.success = '';
  }

  editItem(item: MarketplaceItem): void {
    console.log('🚀 MARKETPLACE MANAGER: ✏️ EDITING ITEM:', item);
    this.editingItem = item;
    this.formData = { ...item };
    this.imagePreview = item.image || null;
    this.showForm = true;
    
    console.log('🚀 MARKETPLACE MANAGER: 📋 Form data loaded:', this.formData);
    console.log('🚀 MARKETPLACE MANAGER: 🖼️ Image preview:', this.imagePreview);
  }

  deleteItem(item: MarketplaceItem): void {
    if (confirm(`Are you sure you want to delete "${item.title}"?`)) {
      if (item.id) {
        this.marketplaceService.deleteMarketplaceItem(item.id).subscribe({
          next: () => {
            this.success = 'Item deleted successfully';
            this.loadMemberItems();
            setTimeout(() => this.success = '', 3000);
          },
          error: (err) => {
            console.error('Error deleting item:', err);
            this.error = 'Failed to delete item';
          }
        });
      }
    }
  }

  onFileSelected(event: Event): void {
    console.log('🚀 MARKETPLACE MANAGER: 📁 File selected event triggered');
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      
      console.log('🚀 MARKETPLACE MANAGER: 📸 File selected:', {
        name: this.selectedFile.name,
        size: this.selectedFile.size,
        type: this.selectedFile.type,
        lastModified: this.selectedFile.lastModified
      });
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
        console.log('🚀 MARKETPLACE MANAGER: 🖼️ Image preview created, length:', this.imagePreview?.length);
      };
      reader.readAsDataURL(this.selectedFile);
      
      // AUTOMATICALLY UPLOAD THE IMAGE
      console.log('🚀 MARKETPLACE MANAGER: 🔄 Auto-uploading selected image...');
      this.uploadImage();
    } else {
      console.log('🚀 MARKETPLACE MANAGER: ❌ No file selected');
    }
  }

  uploadImage(): void {
    if (!this.selectedFile) {
      console.log('🚀 MARKETPLACE MANAGER: ❌ No file to upload');
      return;
    }
    
    console.log('🚀 MARKETPLACE MANAGER: ⬆️ Starting image upload');
    console.log('🚀 MARKETPLACE MANAGER: 📸 File being uploaded:', this.selectedFile.name);
    console.log('🚀 MARKETPLACE MANAGER: 🔗 Upload URL: http://localhost:3000/api/marketplace/upload');
    
    this.uploading = true;
    
    this.marketplaceService.uploadImage(this.selectedFile).subscribe({
      next: (response) => {
        console.log('🚀 MARKETPLACE MANAGER: ✅ Upload response received:', response);
        console.log('🚀 MARKETPLACE MANAGER: 🖼️ Image URL from server:', response.imageUrl);
        
        if (response && response.imageUrl) {
          this.formData.image = response.imageUrl;
          console.log('🚀 MARKETPLACE MANAGER: 📋 Form data image updated to:', this.formData.image);
          console.log('🚀 MARKETPLACE MANAGER: ✅ Image will be saved when form is submitted');
        } else {
          console.log('🚀 MARKETPLACE MANAGER: ❌ Invalid upload response - no imageUrl');
        }
        
        this.uploading = false;
        
        // Test the uploaded image URL
        if (response && response.imageUrl) {
          console.log('🚀 MARKETPLACE MANAGER: 🧪 Testing uploaded image URL:', `http://localhost:3000/${response.imageUrl}`);
          this.testImageAccessibility(response.imageUrl, 999); // Use 999 for uploaded images
        }
      },
      error: (err) => {
        console.error('🚀 MARKETPLACE MANAGER: ❌ Upload error:', err);
        console.error('🚀 MARKETPLACE MANAGER: Error status:', err.status);
        console.error('🚀 MARKETPLACE MANAGER: Error details:', err.error);
        this.error = 'Failed to upload image: ' + (err.error?.message || err.message);
        this.uploading = false;
      }
    });
  }

  onSubmit(): void {
    console.log('🚀 MARKETPLACE MANAGER: 📝 FORM SUBMITTED');
    console.log('🚀 MARKETPLACE MANAGER: 📋 Form data:', this.formData);
    console.log('🚀 MARKETPLACE MANAGER: ✏️ Editing item:', this.editingItem);
    
    // Clear previous messages
    this.error = '';
    this.success = '';
    
    // Validation
    if (!this.formData.title || !this.formData.description || !this.formData.cost) {
      this.error = 'Please fill in all required fields';
      console.log('🚀 MARKETPLACE MANAGER: ❌ VALIDATION FAILED - Missing required fields');
      return;
    }

    const memberEmail = this.currentUser?.email;
    const memberName = this.currentUser?.firstName || this.currentUser?.name || 'Member';
    
    if (!memberEmail) {
      this.error = 'User email not found';
      console.log('🚀 MARKETPLACE MANAGER: ❌ USER EMAIL NOT FOUND');
      return;
    }

    const itemData: Omit<MarketplaceItem, 'id' | 'createdAt'> = {
      title: this.formData.title,
      description: this.formData.description,
      cost: Number(this.formData.cost),
      image: this.formData.image || '',
      memberEmail,
      memberName,
      isActive: this.formData.isActive ?? true
    };

    console.log('🚀 MARKETPLACE MANAGER: 📦 Prepared item data:', itemData);
    console.log('🚀 MARKETPLACE MANAGER: 🖼️ Image data being sent:', {
      originalImage: this.formData.image,
      imageLength: this.formData.image ? this.formData.image.length : 0,
      imageType: typeof this.formData.image,
      imageValue: JSON.stringify(this.formData.image)
    });
    this.loading = true;

    if (this.editingItem && this.editingItem.id) {
      // Update existing item
      console.log('🚀 MARKETPLACE MANAGER: 🔄 UPDATING EXISTING ITEM');
      console.log('🚀 MARKETPLACE MANAGER: 🆔 Item ID:', this.editingItem.id);
      console.log('🚀 MARKETPLACE MANAGER: 📦 Update data:', itemData);
      
      this.marketplaceService.updateMarketplaceItem(this.editingItem.id, itemData).subscribe({
        next: (response) => {
          console.log('🚀 MARKETPLACE MANAGER: ✅ UPDATE SUCCESS:', response);
          this.success = `✅ Item "${itemData.title}" updated successfully!`;
          this.loading = false;
          
          // Reload data and close form
          this.loadMemberItems();
          setTimeout(() => {
            this.resetForm();
            this.showForm = false;
          }, 1000); // Wait 1 second to show success message
          
          // Clear success message after 5 seconds
          setTimeout(() => this.success = '', 5000);
        },
        error: (err) => {
          console.error('🚀 MARKETPLACE MANAGER: ❌ UPDATE ERROR:', err);
          console.error('🚀 MARKETPLACE MANAGER: Error details:', err.error);
          this.error = `❌ Failed to update item "${itemData.title}": ` + (err.error?.message || err.message);
          this.loading = false;
          
          // Clear error message after 5 seconds
          setTimeout(() => this.error = '', 5000);
        }
      });
    } else {
      // Create new item
      console.log('🚀 MARKETPLACE MANAGER: ➕ CREATING NEW ITEM');
      
      this.marketplaceService.createMarketplaceItem(itemData).subscribe({
        next: (response) => {
          console.log('🚀 MARKETPLACE MANAGER: ✅ CREATE SUCCESS:', response);
          this.success = `✅ Item "${itemData.title}" created successfully!`;
          this.loading = false;
          
          // Reload data and close form
          this.loadMemberItems();
          setTimeout(() => {
            this.resetForm();
            this.showForm = false;
          }, 1000); // Wait 1 second to show success message
          
          // Clear success message after 5 seconds
          setTimeout(() => this.success = '', 5000);
        },
        error: (err) => {
          console.error('🚀 MARKETPLACE MANAGER: ❌ CREATE ERROR:', err);
          this.error = `❌ Failed to create item "${itemData.title}": ` + (err.error?.message || err.message);
          this.loading = false;
          
          // Clear error message after 5 seconds
          setTimeout(() => this.error = '', 5000);
        }
      });
    }
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

  // Get full image URL with multiple fallback patterns
  getImageUrl(imagePath: string): string {
    console.log('🚀 MARKETPLACE MANAGER: 🖼️ Getting image URL for:', imagePath);
    
    if (!imagePath) {
      console.log('🚀 MARKETPLACE MANAGER: ❌ No image path provided');
      return '';
    }
    
    // Try different URL patterns
    const urlPatterns = [
      `http://localhost:3000/${imagePath}`, // If path includes uploads/
      `http://localhost:3000/uploads/${imagePath}`, // If path is just filename
      `http://localhost:3000/marketplace/${imagePath}`, // Marketplace folder
      `http://localhost:3000/images/${imagePath}`, // Images folder
    ];
    
    // Return the first pattern (will be tested in accessibility method)
    const url = urlPatterns[0];
    console.log('🚀 MARKETPLACE MANAGER: 📸 Using image URL:', url);
    return url;
  }

  // Handle image loading errors
  handleImageError(event: any): void {
    console.log('🚀 MARKETPLACE MANAGER: ❌ Image failed to load:', event.target.src);
    
    // Try alternative URLs
    const img = event.target;
    const currentSrc = img.src;
    const imagePath = img.getAttribute('data-image-path');
    
    if (!imagePath) {
      // Extract image path from current URL
      const pathMatch = currentSrc.match(/\/([^\/]+)$/);
      if (pathMatch) {
        img.setAttribute('data-image-path', pathMatch[1]);
      }
    }
    
    // Try next URL pattern
    const urlPatterns = [
      `http://localhost:3000/uploads/${imagePath}`,
      `http://localhost:3000/marketplace/${imagePath}`,
      `http://localhost:3000/images/${imagePath}`,
    ];
    
    const triedIndex = parseInt(img.getAttribute('data-tried-index') || '0');
    if (triedIndex < urlPatterns.length) {
      const nextUrl = urlPatterns[triedIndex];
      img.src = nextUrl;
      img.setAttribute('data-tried-index', (triedIndex + 1).toString());
      console.log('🚀 MARKETPLACE MANAGER: 🔄 Trying alternative URL:', nextUrl);
    } else {
      // Hide image if all attempts failed
      console.log('🚀 MARKETPLACE MANAGER: 🚫 All image URL attempts failed, hiding image');
      img.style.display = 'none';
      const imageContainer = img.closest('.item-image');
      if (imageContainer) {
        imageContainer.style.display = 'none';
      }
    }
  }

  // Handle successful image loading
  handleImageLoad(event: any): void {
    console.log('🚀 MARKETPLACE MANAGER: ✅ Image loaded successfully:', event.target.src);
  }

  toggleItemStatus(item: MarketplaceItem): void {
    if (item.id) {
      this.marketplaceService.updateMarketplaceItem(item.id, { isActive: !item.isActive }).subscribe({
        next: () => {
          item.isActive = !item.isActive;
          this.success = `Item ${item.isActive ? 'activated' : 'deactivated'} successfully`;
          setTimeout(() => this.success = '', 3000);
        },
        error: (err) => {
          console.error('Error updating item status:', err);
          this.error = 'Failed to update item status';
        }
      });
    }
  }
}
