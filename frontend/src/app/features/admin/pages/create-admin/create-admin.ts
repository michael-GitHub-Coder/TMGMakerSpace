import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../../shared/header/header';
import { FooterComponent } from '../../../../shared/footer/footer';

@Component({
  selector: 'app-create-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, FooterComponent],
  templateUrl: './create-admin.html',
})
export class CreateAdminComponent implements OnInit {
  createAdminForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.createAdminForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['admin', Validators.required],
    });
  }

  onSubmit(event: Event) {
  event.preventDefault();

  if (this.createAdminForm.valid) {
    const newAdmin = this.createAdminForm.value;
    newAdmin.role = 'admin'; // default role

    // Save to localStorage
    const admins = JSON.parse(localStorage.getItem('admins') || '[]');
    admins.push(newAdmin);
    localStorage.setItem('admins', JSON.stringify(admins));

    alert(`✅ Admin "${newAdmin.name}" created successfully!`);

    // Redirect to dashboard
    this.router.navigate(['/admin/dashboard']);
  }
}
goToDashboard() {
  this.router.navigate(['/admin/dashboard']);
}

}