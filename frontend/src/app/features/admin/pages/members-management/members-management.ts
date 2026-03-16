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

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../../admin/shared/sidebar/sidebar';
import { HeaderComponent } from '../../../../shared/header/header';
import { ApplicationService, Application } from '../../../../shared/Application/Application.service';
import { SafeUrlPipe } from '../../../../shared/safe-url.pipe';

@Component({
  selector: 'app-members-management',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, HeaderComponent, SafeUrlPipe],
  templateUrl: './members-management.html',
})
export class MembersManagement implements OnInit {

  members: Application[] = [];
  loading = false;
  error = '';
  showDocumentsModal = false;
  selectedApplication?: Application;

  constructor(private applicationService: ApplicationService) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.loading = true;
    this.applicationService.getApplications().subscribe({
      next: data => { this.members = data; this.loading = false; },
      error: () => { this.error = 'Failed to load applications'; this.loading = false; }
    });
  }

  viewDocuments(application: Application): void {
    this.selectedApplication = application;
    this.showDocumentsModal = true;
  }

  closeModal(): void {
    this.showDocumentsModal = false;
    this.selectedApplication = undefined;
  }

  approveApplication(member?: Application): void {
    if (!member) return;
    if (!confirm('Approve this membership?')) return;

    this.applicationService.approveApplication(member.id).subscribe({
      next: () => {
        member.status = 'approved';  // update locally
        this.closeModal();
      },
      error: err => alert(`Failed to approve: ${err.message}`)
    });
  }

  rejectApplication(member?: Application): void {
    if (!member) return;

    const reason = prompt('Reason for rejection?');
    if (!reason) return;

    this.applicationService.rejectApplication(member.id, reason).subscribe({
      next: () => {
        member.status = 'rejected';  // update locally
        this.closeModal();
      },
      error: err => alert(`Failed to reject: ${err.message}`)
    });
  }

  getDocumentUrl(doc: string): string {
    return `http://localhost:3000/${doc.replace(/\\/g, '/')}`;
  }

  isPdf(doc: string): boolean {
    return doc.toLowerCase().endsWith('.pdf');
  }

  isImage(doc: string): boolean {
    return ['.jpg', '.jpeg', '.png', '.gif'].some(ext => doc.toLowerCase().endsWith(ext));
  }
}