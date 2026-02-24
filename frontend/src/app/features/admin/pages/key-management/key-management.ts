import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SidebarComponent } from '../../../admin/shared/sidebar/sidebar';
import { FooterComponent } from '../../../../shared/footer/footer';
import { HeaderComponent } from '../../../../shared/header/header';
import { KeyManagementService, KeyManagement } from '../../../../shared/key-management/key-management.service';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-key-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SidebarComponent, FooterComponent, HeaderComponent],
  templateUrl: './key-management.html',
  styleUrls: ['./key-management.css']
})
export class KeyManagementComponent implements OnInit {
  keys: KeyManagement[] = [];
  filteredKeys: KeyManagement[] = [];
  searchTerm: string = '';
  statusFilter: string = 'all';
  loading: boolean = false;
  currentAdmin: string = '';
  selectedKey: KeyManagement | null = null;
  
  // Form data for issuing keys
  issueFormData = {
    memberName: '',
    memberEmail: '',
    memberPhone: '',
    bookingDateTime: '',
    notes: ''
  };

  constructor(
    private modalService: NgbModal,
    private keyManagementService: KeyManagementService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadKeys();
    this.loadCurrentUser();
  }

  loadKeys(): void {
    this.loading = true;
    // Subscribe to the service to get real-time updates
    this.keyManagementService.keys$.subscribe(keys => {
      this.keys = keys;
      this.applyFilters();
      this.loading = false;
    });
  }

  loadCurrentUser(): void {
    const currentUser = this.authService.getCurrentUser();
    this.currentAdmin = currentUser?.name || 'Admin User';
  }

  applyFilters(): void {
    this.filteredKeys = this.keys.filter(key => {
      const matchesSearch = this.searchTerm === '' || 
        key.equipmentName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        key.memberName.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.statusFilter === 'all' || key.keyStatus === this.statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'available':
        return 'status-badge available';
      case 'issued':
        return 'status-badge issued';
      case 'returned':
        return 'status-badge returned';
      default:
        return 'status-badge';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'available':
        return 'bi-check-circle-fill';
      case 'issued':
        return 'bi-key-fill';
      case 'returned':
        return 'bi-arrow-counterclockwise';
      default:
        return 'bi-question-circle';
    }
  }

  canIssueKey(key: KeyManagement): boolean {
    return key.keyStatus === 'available';
  }

  canReturnKey(key: KeyManagement): boolean {
    return key.keyStatus === 'issued';
  }

  openIssueKeyModal(content: any, key: KeyManagement): void {
    if (!this.canIssueKey(key)) return;
    
    this.selectedKey = key;
    // Reset form data
    this.issueFormData = {
      memberName: '',
      memberEmail: '',
      memberPhone: '',
      bookingDateTime: '',
      notes: ''
    };
    
    this.modalService.open(content, {
      centered: true,
      backdrop: 'static'
    });
  }

  openReturnKeyModal(content: any, key: KeyManagement): void {
    if (!this.canReturnKey(key)) return;
    
    this.selectedKey = key;
    this.modalService.open(content, {
      centered: true,
      backdrop: 'static'
    });
  }

  async issueKey(modal: NgbModalRef): Promise<void> {
    if (!this.selectedKey) return;
    
    try {
      this.loading = true;
      
      // Prepare the issue request with person details
      const issueRequest = {
        issuedBy: this.currentAdmin,
        memberName: this.issueFormData.memberName,
        memberEmail: this.issueFormData.memberEmail,
        memberPhone: this.issueFormData.memberPhone,
        bookingDateTime: this.issueFormData.bookingDateTime,
        notes: this.issueFormData.notes
      };
      
      // Call the service to issue the key with person details
      await this.keyManagementService.issueKey(this.selectedKey.id, issueRequest);
      
      // Refresh the keys from the service
      this.loadKeys();
      
      console.log('Key successfully issued to ' + this.issueFormData.memberName);
      alert('Key successfully issued to ' + this.issueFormData.memberName);
      this.selectedKey = null;
      modal.close();
    } catch (error: any) {
      console.error('Error issuing key:', error);
      alert('Error issuing key: ' + error.message);
    } finally {
      this.loading = false;
    }
  }

  async returnKey(modal: NgbModalRef): Promise<void> {
    if (!this.selectedKey) return;
    
    try {
      this.loading = true;
      
      // Call the service to return the key
      await this.keyManagementService.returnKey(this.selectedKey.id, this.currentAdmin);
      
      // Refresh the keys from the service
      this.loadKeys();
      
      console.log('Key successfully returned from ' + this.selectedKey!.memberName);
      alert('Key successfully returned from ' + this.selectedKey!.memberName);
      this.selectedKey = null;
      modal.close();
    } catch (error: any) {
      console.error('Error returning key:', error);
      alert('Error returning key: ' + error.message);
    } finally {
      this.loading = false;
    }
  }

  getStats(): { total: number; available: number; issued: number; returned: number } {
    return {
      total: this.keys.length,
      available: this.keys.filter(k => k.keyStatus === 'available').length,
      issued: this.keys.filter(k => k.keyStatus === 'issued').length,
      returned: this.keys.filter(k => k.keyStatus === 'returned').length
    };
  }
}
