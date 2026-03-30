import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationService } from '../../shared/Application/Application.service';

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
  
  @ViewChild('documents') documentsInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private applicationService: ApplicationService,
    private router: Router
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

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  triggerFileInput(): void {
    this.documentsInput.nativeElement.click();
  }

  goHome(): void {
    this.router.navigate(['/']);
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
    } catch (error) {
      this.errorMessage = 'Failed to submit application. Please try again.';
      console.error(error);
    } finally {
      this.isSubmitting = false;
    }
  }
}
