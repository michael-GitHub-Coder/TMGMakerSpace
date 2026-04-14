// import { Component, OnInit } from '@angular/core';
// import { Router, RouterModule } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { SidebarComponent } from '../../../admin/shared/sidebar/sidebar';
// import { HeaderComponent } from '../../../../shared/header/header';
// import { ApplicationService, Application } from '../../../../shared/Application/Application.service';
// import { Observable } from 'rxjs';
// import { SafeUrlPipe } from '../../../../shared/safe-url.pipe';

// @Component({
//   selector: 'app-members-management',
//   standalone: true,
//   imports: [CommonModule, RouterModule, SidebarComponent, HeaderComponent],
//   templateUrl: './members-management.html',
// })
// export class MembersManagement implements OnInit {

//   members: Application[] = [];
//   loading = false;
//   error = '';


//   showDocumentsModal = false;
//   selectedApplication?: Application;

//   constructor(
//     private router: Router,
//     private applicationService: ApplicationService
//   ) {}

//   ngOnInit(): void {
//     this.loadApplications();
//   }

//   loadApplications(): void {
//     this.loading = true;
//     this.applicationService.getApplications().subscribe({
//       next: (data) => {
//         this.members = data;
//         this.loading = false;
//       },
//       error: () => {
//         this.error = 'Failed to load applications';
//         this.loading = false;
//       }
//     });
//   }

//   viewDocuments(application: Application): void {
//     this.selectedApplication = application;
//     this.showDocumentsModal = true;
//   }

//   closeModal(): void {
//     this.showDocumentsModal = false;
//     this.selectedApplication = undefined;
//   }


//   approveApplication(id?: number): void {
//     if (!id) return;
//     this.applicationService.approveApplication(id).subscribe(() => {
//       this.loadApplications();
//       this.closeModal();
//     });
//   }

//   rejectApplication(id?: number): void {
//     if (!id) return;
//     this.applicationService.rejectApplication(id).subscribe(() => {
//       this.loadApplications();
//       this.closeModal();
//     });
//   }

//   getDocumentUrl(doc: string): string {
//     return `http://localhost:3000/${doc.replace(/\\/g, '/')}`;
//   }

//   isPdf(doc: string): boolean {
//     return doc.toLowerCase().endsWith('.pdf');
//   }

//   isImage(doc: string): boolean {
//     return ['.jpg', '.jpeg', '.png', '.gif'].some(ext => doc.toLowerCase().endsWith(ext));
//   }
// }



// import { Component, OnInit } from '@angular/core';
// import { Router, RouterModule } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
// import { SidebarComponent } from '../../../admin/shared/sidebar/sidebar';
// import { HeaderComponent } from '../../../../shared/header/header';
// import { ApplicationService, Application } from '../../../../shared/Application/Application.service';

// @Component({
//   selector: 'app-members-management',
//   standalone: true,
//   imports: [CommonModule, RouterModule, FormsModule, SidebarComponent, HeaderComponent],
//   templateUrl: './members-management.html',
//   styleUrls: ['./members-management.css']
// })
// export class MembersManagement implements OnInit {

//   members: Application[] = [];
//   loading = false;
//   error = '';

//   // Document preview modal
//   showDocumentsModal = false;
//   selectedApplication?: Application;
//   currentDocumentIndex = 0;
//   currentDocumentUrl: SafeResourceUrl | null = null;
//   currentDocumentType: 'image' | 'pdf' | 'other' = 'other';

//   // Rejection modal
//   showRejectModal = false;
//   rejectionReason = '';

//   constructor(
//     private router: Router,
//     private applicationService: ApplicationService,
//     private sanitizer: DomSanitizer
//   ) {}

//   ngOnInit(): void {
//     this.loadApplications();
//   }

//   loadApplications(): void {
//     this.loading = true;
//     this.applicationService.getApplications().subscribe({
//       next: (data) => {
//         this.members = data;
//         this.loading = false;
//       },
//       error: () => {
//         this.error = 'Failed to load applications';
//         this.loading = false;
//       }
//     });
//   }

//   // Open documents modal and load first document
//   viewDocuments(application: Application): void {
//     if (!application.documents || application.documents.length === 0) {
//       alert('No documents available for this application');
//       return;
//     }

//     this.selectedApplication = application;
//     this.currentDocumentIndex = 0;
//     this.showDocumentsModal = true;
//     this.loadDocument(0);
//   }

//   // Close modal
//   closeModal(): void {
//     this.showDocumentsModal = false;
//     this.selectedApplication = undefined;
//     this.currentDocumentUrl = null;
//   }

//   // Load specific document by index
//   loadDocument(index: number): void {
//     if (!this.selectedApplication?.documents || 
//         index < 0 || 
//         index >= this.selectedApplication.documents.length) {
//       return;
//     }

//     this.currentDocumentIndex = index;
//     const docPath = this.selectedApplication.documents[index];
    
//     // Determine document type
//     if (this.isImage(docPath)) {
//       this.currentDocumentType = 'image';
//     } else if (this.isPdf(docPath)) {
//       this.currentDocumentType = 'pdf';
//     } else {
//       this.currentDocumentType = 'other';
//     }

//     // Create safe URL
//     const url = this.getDocumentUrl(docPath);
//     this.currentDocumentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
//   }

//   // Navigate to previous document
//   previousDocument(): void {
//     if (this.currentDocumentIndex > 0) {
//       this.loadDocument(this.currentDocumentIndex - 1);
//     }
//   }

//   // Navigate to next document
//   nextDocument(): void {
//     if (this.selectedApplication?.documents && 
//         this.currentDocumentIndex < this.selectedApplication.documents.length - 1) {
//       this.loadDocument(this.currentDocumentIndex + 1);
//     }
//   }

//   // Get current document name
//   getCurrentDocumentName(): string {
//     if (!this.selectedApplication?.documents) return '';
//     const path = this.selectedApplication.documents[this.currentDocumentIndex];
//     return path.split(/[\\/]/).pop() || path;
//   }

//   // Helper functions
//   getDocumentUrl(doc: string): string {
//     return `http://localhost:3000/${doc.replace(/\\/g, '/')}`;
//   }

//   isPdf(doc: string): boolean {
//     return doc.toLowerCase().endsWith('.pdf');
//   }

//   isImage(doc: string): boolean {
//     return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'].some(ext => 
//       doc.toLowerCase().endsWith(ext)
//     );
//   }

//   getStatusClass(status?: string): string {
//     switch (status) {
//       case 'approved': return 'status-badge active';
//       case 'rejected': return 'status-badge inactive';
//       case 'pending': return 'status-badge pending';
//       default: return 'status-badge pending';
//     }
//   }

//   // Approve application
//   approveApplication(id?: number): void {
//     if (!id) return;
    
//     if (!confirm('Are you sure you want to approve this application?')) {
//       return;
//     }

//     this.applicationService.approveApplication(id).subscribe({
//       next: () => {
//         alert('Application approved successfully!');
//         this.loadApplications();
//         this.closeModal();
//       },
//       error: (error) => {
//         console.error('Error approving application:', error);
//         alert('Failed to approve application. Please try again.');
//       }
//     });
//   }

//   // Open reject modal
//   openRejectModal(id?: number): void {
//     if (!id) return;
//     this.showRejectModal = true;
//     this.rejectionReason = '';
//   }

//   // Close reject modal
//   closeRejectModal(): void {
//     this.showRejectModal = false;
//     this.rejectionReason = '';
//   }

//   // Confirm rejection with reason
//   confirmRejection(): void {
//     if (!this.selectedApplication?.id) return;
    
//     if (!this.rejectionReason.trim()) {
//       alert('Please provide a rejection reason');
//       return;
//     }

//     this.applicationService.rejectApplication(this.selectedApplication.id, this.rejectionReason).subscribe({
//       next: () => {
//         alert('Application rejected successfully!');
//         this.loadApplications();
//         this.closeModal();
//         this.closeRejectModal();
//       },
//       error: (error) => {
//         console.error('Error rejecting application:', error);
//         alert('Failed to reject application. Please try again.');
//       }
//     });
//   }

//   // Format date
//   formatDate(date: any): string {
//     if (!date) return 'N/A';
//     return new Date(date).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   }
// }


import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SidebarComponent } from '../../../admin/shared/sidebar/sidebar';
import { ApplicationService, Application } from '../../../../shared/Application/Application.service';

@Component({
  selector: 'app-members-management',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SidebarComponent],
  templateUrl: './members-management.html',
  styleUrls: ['./members-management.css']
})
export class MembersManagement implements OnInit {

  members: Application[] = [];
  filteredMembers: Application[] = [];
  paginatedMembers: Application[] = [];
  loading = false;
  error = '';

  // Pagination
  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 0;
  pages: number[] = [];

  // Document preview modal
  showDocumentsModal = false;
  selectedApplication?: Application;
  currentDocumentIndex = 0;
  currentDocumentUrl: SafeResourceUrl | null = null;
  currentDocumentType: 'image' | 'pdf' | 'other' = 'other';

  // Rejection modal
  showRejectModal = false;
  rejectionReason = '';

  constructor(
    private router: Router,
    private applicationService: ApplicationService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.loading = true;
    this.applicationService.getApplications().subscribe({
      next: (data) => {
        this.members = data;
        this.filteredMembers = data;
        this.updatePagination();
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load applications';
        this.loading = false;
      }
    });
  }

  // Pagination methods
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredMembers.length / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updatePaginatedMembers();
  }

  updatePaginatedMembers(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedMembers = this.filteredMembers.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedMembers();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedMembers();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedMembers();
    }
  }

  getStartIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  getEndIndex(): number {
    const end = this.currentPage * this.itemsPerPage;
    return end > this.filteredMembers.length ? this.filteredMembers.length : end;
  }

  // Open documents modal and load first document
  viewDocuments(application: Application): void {
    if (!application.documents || application.documents.length === 0) {
      alert('No documents available for this application');
      return;
    }

    this.selectedApplication = application;
    this.currentDocumentIndex = 0;
    this.showDocumentsModal = true;
    this.loadDocument(0);
  }

  // Close modal
  closeModal(): void {
    this.showDocumentsModal = false;
    this.selectedApplication = undefined;
    this.currentDocumentUrl = null;
  }

  // Load specific document by index
  loadDocument(index: number): void {
    if (!this.selectedApplication?.documents || 
        index < 0 || 
        index >= this.selectedApplication.documents.length) {
      return;
    }

    this.currentDocumentIndex = index;
    const docPath = this.selectedApplication.documents[index];
    
    // Determine document type
    if (this.isImage(docPath)) {
      this.currentDocumentType = 'image';
    } else if (this.isPdf(docPath)) {
      this.currentDocumentType = 'pdf';
    } else {
      this.currentDocumentType = 'other';
    }

    // Create safe URL
    const url = this.getDocumentUrl(docPath);
    this.currentDocumentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  // Navigate to previous document
  previousDocument(): void {
    if (this.currentDocumentIndex > 0) {
      this.loadDocument(this.currentDocumentIndex - 1);
    }
  }

  // Navigate to next document
  nextDocument(): void {
    if (this.selectedApplication?.documents && 
        this.currentDocumentIndex < this.selectedApplication.documents.length - 1) {
      this.loadDocument(this.currentDocumentIndex + 1);
    }
  }

  // Get current document name
  getCurrentDocumentName(): string {
    if (!this.selectedApplication?.documents) return '';
    const path = this.selectedApplication.documents[this.currentDocumentIndex];
    return path.split(/[\\/]/).pop() || path;
  }

  // Helper functions
  getDocumentUrl(doc: string): string {
    return `http://localhost:3000/${doc.replace(/\\/g, '/')}`;
  }

  isPdf(doc: string): boolean {
    return doc.toLowerCase().endsWith('.pdf');
  }

  isImage(doc: string): boolean {
    return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'].some(ext => 
      doc.toLowerCase().endsWith(ext)
    );
  }

  getStatusClass(status?: string): string {
    switch (status) {
      case 'approved': return 'status-badge active';
      case 'rejected': return 'status-badge inactive';
      case 'pending': return 'status-badge pending';
      default: return 'status-badge pending';
    }
  }

  // Approve application
  approveApplication(id?: number): void {
    if (!id) return;
    
    if (!confirm('Are you sure you want to approve this application?')) {
      return;
    }

    this.applicationService.approveApplication(id).subscribe({
      next: () => {
        alert('Application approved successfully!');
        this.loadApplications();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error approving application:', error);
        alert('Failed to approve application. Please try again.');
      }
    });
  }

  // Open reject modal
  openRejectModal(id?: number): void {
    if (!id) return;
    this.showRejectModal = true;
    this.rejectionReason = '';
  }

  // Close reject modal
  closeRejectModal(): void {
    this.showRejectModal = false;
    this.rejectionReason = '';
  }

  // Confirm rejection with reason
  confirmRejection(): void {
    if (!this.selectedApplication?.id) return;
    
    if (!this.rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    this.applicationService.rejectApplication(this.selectedApplication.id, this.rejectionReason).subscribe({
      next: () => {
        alert('Application rejected successfully!');
        this.loadApplications();
        this.closeModal();
        this.closeRejectModal();
      },
      error: (error) => {
        console.error('Error rejecting application:', error);
        alert('Failed to reject application. Please try again.');
      }
    });
  }

  // Format date
  formatDate(date: any): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}