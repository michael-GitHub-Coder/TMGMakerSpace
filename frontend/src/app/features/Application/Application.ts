// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { ApplicationService } from '../../shared/Application/Application.service';

// @Component({
//   selector: 'app-application',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule
//   ],
//   templateUrl: './Application.html',
//   styleUrls: ['./Application.css']
// })
// export class ApplicationComponent {
//   applicationForm: FormGroup;
//   selectedFiles: File[] = [];
//   isSubmitting = false;
//   successMessage = '';
//   errorMessage = '';

//   constructor(
//     private fb: FormBuilder,
//     private applicationService: ApplicationService
//   ) {
//     this.applicationForm = this.fb.group({
//       name: ['', Validators.required],
//       surname: ['', Validators.required],
//       email: ['', [Validators.required, Validators.email]],
//       phone: ['', Validators.required]
//     });
//   }

//   onFileChange(event: any) {
//     if (event.target.files?.length) {
//       this.selectedFiles = Array.from(event.target.files);
//     }
//   }

//   async onSubmit() {
//     if (this.applicationForm.invalid) {
//       this.applicationForm.markAllAsTouched();
//       return;
//     }

//     this.isSubmitting = true;
//     this.errorMessage = '';
//     this.successMessage = '';

//     try {
//       await this.applicationService.createApplication(
//         this.applicationForm.value.name,
//         this.applicationForm.value.surname,
//         this.applicationForm.value.email,
//         this.applicationForm.value.phone,
//         this.selectedFiles
//       );

//       this.successMessage = 'Application submitted successfully 🎉';
//       this.applicationForm.reset();
//       this.selectedFiles = [];
//     } catch (error) {
//       this.errorMessage = 'Failed to submit application. Please try again.';
//       console.error(error);
//     } finally {
//       this.isSubmitting = false;
//     }
//   }
// }


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApplicationService } from '../../shared/Application/Application.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-application',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './Application.html',
  styleUrls: ['./Application.css']
})
export class ApplicationComponent {
  applicationForm: FormGroup;
  selectedFiles: File[] = [];
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';
  
  // Document preview modal
  showDocumentModal = false;
  currentDocumentIndex = 0;
  currentDocumentUrl: SafeUrl | null = null;
  currentDocumentType: 'image' | 'pdf' | 'other' = 'other';

  constructor(
    private fb: FormBuilder,
    private applicationService: ApplicationService,
    private sanitizer: DomSanitizer
  ) {
    this.applicationForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required]
    });
  }

  onFileChange(event: any) {
    if (event.target.files?.length) {
      this.selectedFiles = Array.from(event.target.files);
    }
  }

  // Open document preview modal
  openDocumentModal() {
    if (this.selectedFiles.length === 0) {
      this.errorMessage = 'No documents uploaded yet';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }
    
    this.currentDocumentIndex = 0;
    this.showDocumentModal = true;
    this.loadDocument(0);
  }

  // Close modal
  closeDocumentModal() {
    this.showDocumentModal = false;
    this.currentDocumentUrl = null;
    this.revokeObjectUrl();
  }

  // Load a specific document
  loadDocument(index: number) {
    if (index < 0 || index >= this.selectedFiles.length) return;
    
    this.currentDocumentIndex = index;
    const file = this.selectedFiles[index];
    
    // Revoke previous URL to prevent memory leaks
    this.revokeObjectUrl();
    
    // Determine file type
    if (file.type.startsWith('image/')) {
      this.currentDocumentType = 'image';
    } else if (file.type === 'application/pdf') {
      this.currentDocumentType = 'pdf';
    } else {
      this.currentDocumentType = 'other';
    }
    
    // Create object URL and sanitize
    const objectUrl = URL.createObjectURL(file);
    this.currentDocumentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);
  }

  // Navigate to previous document
  previousDocument() {
    if (this.currentDocumentIndex > 0) {
      this.loadDocument(this.currentDocumentIndex - 1);
    }
  }

  // Navigate to next document
  nextDocument() {
    if (this.currentDocumentIndex < this.selectedFiles.length - 1) {
      this.loadDocument(this.currentDocumentIndex + 1);
    }
  }

  // Remove a document from the list
  removeDocument(index: number) {
    this.selectedFiles.splice(index, 1);
    
    if (this.selectedFiles.length === 0) {
      this.closeDocumentModal();
    } else if (this.currentDocumentIndex >= this.selectedFiles.length) {
      this.loadDocument(this.selectedFiles.length - 1);
    } else {
      this.loadDocument(this.currentDocumentIndex);
    }
  }

  // Get current file info
  getCurrentFileName(): string {
    return this.selectedFiles[this.currentDocumentIndex]?.name || '';
  }

  getCurrentFileSize(): string {
    const bytes = this.selectedFiles[this.currentDocumentIndex]?.size || 0;
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  // Clean up object URLs
  private revokeObjectUrl() {
    if (this.currentDocumentUrl) {
      const url = (this.currentDocumentUrl as any).changingThisBreaksApplicationSecurity;
      if (url) {
        URL.revokeObjectURL(url);
      }
    }
  }

  async onSubmit() {
    if (this.applicationForm.invalid) {
      this.applicationForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      await this.applicationService.createApplication(
        this.applicationForm.value.name,
        this.applicationForm.value.surname,
        this.applicationForm.value.email,
        this.applicationForm.value.phone,
        this.selectedFiles
      );

      this.successMessage = 'Application submitted successfully ';
      this.applicationForm.reset();
      this.selectedFiles = [];
      this.closeDocumentModal();
    } catch (error) {
      this.errorMessage = 'Failed to submit application. Please try again.';
      console.error(error);
    } finally {
      this.isSubmitting = false;
    }
  }

  // Clean up on component destroy
  ngOnDestroy() {
    this.revokeObjectUrl();
  }
}