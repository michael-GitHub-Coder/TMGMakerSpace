import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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

  constructor(
    private fb: FormBuilder,
    private applicationService: ApplicationService
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
