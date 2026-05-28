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
    this.loading = true;
    const memberEmail = this.currentUser?.email;
    
    if (!memberEmail) {
      this.error = 'User email not found. Please log in again.';
      this.loading = false;
      return;
    }

    this.marketplaceService.getMemberMarketplaceItems(memberEmail).subscribe({
      next: (items) => {
        this.marketplaceItems = items;
        
        // Debug image URLs for each item
        items.forEach((item, index) => {
          // Test image accessibility
          if (item.image) {
            this.testImageAccessibility(item.image, index + 1);
          }
        });
        
        this.loading = false;
      },
      error: (error) => {
        console.error('🚀 MARKETPLACE MANAGER: ❌ ERROR LOADING ITEMS:', error);
        this.error = 'Failed to load marketplace items. Please try again.';
        this.loading = false;
      }
    });
  }

  // Test if image URL is accessible
  testImageAccessibility(imagePath: string, itemIndex: number): void {
    // Only test the correct URL pattern
    const testUrl = `http://localhost:3000/${imagePath}`;
    const testImg = new Image();
    testImg.onload = () => {
      console.log(`✅ Image ${itemIndex} accessible: ${testUrl}`);
    };
    testImg.onerror = () => {
      console.log(`❌ Image ${itemIndex} failed: ${testUrl}`);
    };
    testImg.src = testUrl;
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
    this.editingItem = item;
    this.formData = { ...item };
    // Set imagePreview to full URL for proper display in edit form
    this.imagePreview = item.image ? this.getImageUrl(item.image) : null;
    this.showForm = true;
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
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      
      // Check file size (50MB limit)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (this.selectedFile.size > maxSize) {
        this.error = `File size (${(this.selectedFile.size / 1024 / 1024).toFixed(2)}MB) exceeds the maximum allowed size (50MB). Please choose a smaller image.`;
        // Clear the file input
        input.value = '';
        return;
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(this.selectedFile.type)) {
        this.error = 'Invalid file type. Please select a valid image file (JPG, PNG, or GIF).';
        // Clear the file input
        input.value = '';
        return;
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
      
      // AUTOMATICALLY UPLOAD THE IMAGE
      this.uploadImage();
    }
  }

  uploadImage(): void {
    if (!this.selectedFile) {
      return;
    }
    
    this.uploading = true;
    
    this.marketplaceService.uploadImage(this.selectedFile).subscribe({
      next: (response) => {
        if (response && response.imageUrl) {
          this.formData.image = response.imageUrl;
        }
        
        this.uploading = false;
        
        // Test to uploaded image URL
        if (response && response.imageUrl) {
          this.testImageAccessibility(response.imageUrl, 999); // Use 999 for uploaded images
        }
      },
      error: (err) => {
        this.error = 'Failed to upload image: ' + (err.error?.message || err.message);
        this.uploading = false;
      }
    });
  }

  onSubmit(): void {
    // Clear previous messages
    this.error = '';
    this.success = '';
    
    // Validation
    if (!this.formData.title || !this.formData.description || !this.formData.cost) {
      this.error = 'Please fill in all required fields';
      return;
    }

    const memberEmail = this.currentUser?.email;
    const memberName = this.currentUser?.firstName || this.currentUser?.name || 'Member';
    
    if (!memberEmail) {
      this.error = 'User email not found';
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

    this.loading = true;

    if (this.editingItem && this.editingItem.id) {
      // Update existing item
      
      this.marketplaceService.updateMarketplaceItem(this.editingItem.id, itemData).subscribe({
        next: (response) => {
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
          this.error = `❌ Failed to update item "${itemData.title}": ` + (err.error?.message || err.message);
          this.loading = false;
          
          // Clear error message after 5 seconds
          setTimeout(() => this.error = '', 5000);
        }
      });
    } else {
      // Create new item
      this.marketplaceService.createMarketplaceItem(itemData).subscribe({
        next: (response) => {
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

  // Get image URL - only real images
  getImageUrl(imagePath: string): string {
    // Return empty for no images - *ngIf will handle hiding the container
    if (!imagePath || imagePath.trim() === '') {
      return '';
    }
    
    // Backend stores images as "uploads/marketplace/filename.png" and serves them at "/uploads/marketplace/filename.png"
    // So we need to use the exact path that's stored in the database
    const url = `http://localhost:3000/${imagePath}`;
    return url;
  }

  // Handle image loading errors
  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }

  removeImage(): void {
    this.imagePreview = null;
    this.selectedFile = null;
    this.formData.image = '';
    
    // Clear the file input
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  // Handle successful image loading
  handleImageLoad(event: any): void {
    // Image loaded successfully
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
