import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SidebarComponent } from '../../admin/shared/sidebar/sidebar';
import { FooterComponent } from '../../../shared/footer/footer';
import { BookingComponent,Booking } from '../../public/pages/booking/booking';
import { BookingService } from '../../../shared/booking/booking.service';
import { AuthService } from '../../../shared/services/auth.service';
import { BlogApiService, Blog } from '../../../services/blog-api.service';
import { MarketplaceManagerComponent } from '../components/marketplace-manager/marketplace-manager.component';
import { filter } from 'rxjs/operators';

interface Member {
  name: string;
  joinedAt: string;
}

interface BlogPost {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  author?: string;
  tags?: string[];
  content?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Admin {
  name: string;
  email: string;
  role: string;
}

interface Document {
  id: string;
  name: string;
  url: string;
  type: string;
}

// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [CommonModule, RouterModule, SidebarComponent, HeaderComponent],
//   templateUrl: './mdashboard.html',
//   styleUrls: ['./mdashboard.css']
// })

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MarketplaceManagerComponent, SidebarComponent],
  templateUrl: './mdashboard.html',
  styleUrls: ['./mdashboard.css']
})

export class DashboardComponent implements OnInit, OnDestroy {
  blogs: BlogPost[] = [];
  bookings: Booking[] = [];
  documents: Document[] = [];
  memberKeys: any[] = [];
  name: string = '';
  email: string = '';
  role: string = '';
  isMember: boolean = false;
  isLoading: boolean = true;
  hasLoadedData: boolean = false;
  showPasswordChangeWarning: boolean = false;

  constructor(
    private router: Router,
    private bookingService: BookingService,
    private authService: AuthService,
    private blogApiService: BlogApiService,
    private http: HttpClient
  ) {
    // Listen for router events to refresh data when returning to dashboard
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (event.urlAfterRedirects === '/member/dashboard' || event.url === '/member/dashboard') {
        this.loadDashboardData();
        // Scroll to dashboard content area (account for sidebar)
        this.scrollToDashboardContent();
      }
    });
  }

  ngOnInit() {
    this.loadDashboardData();
    // Scroll to dashboard content area (account for sidebar)
    this.scrollToDashboardContent();
  }

  // Load fresh dashboard data
  loadDashboardData() {
    this.isLoading = true;
    console.log('🚀 MEMBER DASHBOARD: Loading dashboard data...');
    
    const user = this.authService.getCurrentUser();
    console.log('🚀 MEMBER DASHBOARD: User data:', user);
    
    this.name = user?.firstName || user?.name || 'Member';
    this.email = user?.email || 'member@example.com';
    this.role = user?.role || '';
    this.isMember = this.role?.toLowerCase() === 'member';
    
    console.log('🚀 MEMBER DASHBOARD: Dashboard info:', { name: this.name, email: this.email, role: this.role });
    
    // Check if user must change password and show warning
    if (user && user.mustChangePassword) {
      console.log('🔐 MEMBER DASHBOARD: User must change password - showing warning');
      this.showPasswordChangeWarning = true;
    } else {
      this.showPasswordChangeWarning = false;
    }
    
    // Hide password change warning if user is coming from account page (just changed password)
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Check if navigation is coming from account page with password change success
      const isFromAccountPage = event.urlAfterRedirects?.includes('/member/account');
      const hasPasswordChangeSuccess = sessionStorage.getItem('password_change_success') === 'true';
      
      if (isFromAccountPage && hasPasswordChangeSuccess) {
        console.log('🔐 MEMBER DASHBOARD: User changed password successfully - hiding warning');
        this.showPasswordChangeWarning = false;
        // Clear the password change success flag
        sessionStorage.removeItem('password_change_success');
      }
    });
    
    // Also check on component initialization in case user is already on dashboard
    setTimeout(() => {
      const hasPasswordChangeSuccess = sessionStorage.getItem('password_change_success') === 'true';
      if (hasPasswordChangeSuccess) {
        console.log('🔐 MEMBER DASHBOARD: Initial check - hiding warning after password change');
        this.showPasswordChangeWarning = false;
        sessionStorage.removeItem('password_change_success');
      }
    }, 500);
    
    // Store joined date for account page if not already stored
    if (user && this.isMember && !user.joinedAt) {
      user.joinedAt = new Date().toLocaleDateString();
    }
    
    // Load fresh data from APIs
    this.loadBlogs();
    this.loadBookings();
    this.loadMemberKeys();
  }

  // Load bookings data
  loadBookings(): void {
    console.log('🚀 MEMBER DASHBOARD: Loading bookings...');
    this.bookingService.bookings$.subscribe(bookings => {
      console.log('🚀 MEMBER DASHBOARD: Bookings loaded:', bookings);
      this.bookings = bookings;
      this.checkLoadingComplete();
    });
  }

  // Load member's laser cutter keys
  loadMemberKeys(): void {
    console.log('🚀 MEMBER DASHBOARD: Loading member laser cutter keys...');
    const user = this.authService.getCurrentUser();
    const memberName = user?.firstName || user?.name || 'Member';
    
    this.http.get<any[]>(`http://localhost:3000/api/v1/keys/member/${encodeURIComponent(memberName)}`).subscribe({
      next: (keys: any[]) => {
        console.log('🚀 MEMBER DASHBOARD: Member keys loaded:', keys);
        // Filter only laser cutter keys that are currently issued
        this.memberKeys = keys.filter(key => 
          key.equipmentName.toLowerCase().includes('laser') && 
          key.keyStatus === 'issued'
        );
        console.log('🚀 MEMBER DASHBOARD: Laser cutter keys filtered:', this.memberKeys);
        this.checkLoadingComplete();
      },
      error: (error: any) => {
        // Handle 404 (no keys found) gracefully - this is expected behavior
        if (error.status === 404) {
          console.log('🚀 MEMBER DASHBOARD: No keys found for member (expected behavior)');
        } else {
          console.error('🚀 MEMBER DASHBOARD: Error loading member keys:', error);
        }
        this.memberKeys = [];
        this.checkLoadingComplete();
      }
    });
  }

  // Check if all data has loaded
  checkLoadingComplete(): void {
    console.log('Checking loading complete...');
    // Use a timeout to ensure all data has time to load
    setTimeout(() => {
      this.isLoading = false;
      this.hasLoadedData = true;
      console.log('Dashboard data loading complete - showing content');
    }, 500);
  }

  loadBlogs(): void {
    console.log('🚀 MEMBER DASHBOARD: Loading blogs...');
    this.blogApiService.getAllBlogs().subscribe({
      next: (blogs: BlogPost[]) => {
        console.log('🚀 MEMBER DASHBOARD: Blogs loaded:', blogs);
        this.blogs = blogs;
        this.checkLoadingComplete();
      },
      error: (error) => {
        console.error('🚀 MEMBER DASHBOARD: Error loading blogs for member dashboard:', error);
        this.blogs = [];
        this.checkLoadingComplete();
      }
    });
  }

  loadDocuments(): void {
    // Get current user's documents from backend
    const user = this.authService.getCurrentUser();
    if (!user?.email) {
      console.error('No user found for documents loading');
      return;
    }

    // Load real documents from backend based on member email
    console.log('🚀 MEMBER DASHBOARD: Loading documents for user:', user.email);
    
    // Fetch member-specific documents from membership applications
    this.http.get<any[]>(`http://localhost:3000/memberships`).subscribe({
      next: (applications: any[]) => {
        console.log('🚀 MEMBER DASHBOARD: Membership applications loaded:', applications);
        
        // Find the member's application by email
        const memberApplication = applications.find(app => 
          app.email && app.email.toLowerCase() === user.email.toLowerCase()
        );
        
        if (memberApplication && memberApplication.documents && memberApplication.documents.length > 0) {
          console.log('🚀 MEMBER DASHBOARD: Found member application with documents:', memberApplication.documents);
          
          // Convert document paths to document objects
          this.documents = memberApplication.documents.map((docPath: string, index: number) => {
            const filename = docPath.split('/').pop() || `document-${index}`;
            const fullUrl = docPath.startsWith('uploads/') 
              ? `http://localhost:3000/${docPath}`
              : `http://localhost:3000/uploads/${docPath}`;
            
            console.log(`🚀 MEMBER DASHBOARD: Processing document ${index}:`, {
              originalPath: docPath,
              filename: filename,
              fullUrl: fullUrl,
              type: this.getDocumentTypeFromName(filename)
            });
            
            return {
              id: `doc-${index}`,
              name: filename,
              url: fullUrl,
              type: this.getDocumentTypeFromName(filename)
            };
          });
          
          console.log('🚀 MEMBER DASHBOARD: Member documents processed:', this.documents);
        } else {
          console.log('🚀 MEMBER DASHBOARD: No documents found for member - adding sample documents for testing');
          // Add sample documents for testing if no real documents exist
          this.documents = [
            {
              id: 'sample-1',
              name: 'sample-document.jpg',
              url: 'https://picsum.photos/800/600', // Sample image for testing
              type: 'image'
            },
            {
              id: 'sample-2', 
              name: 'sample-pdf.pdf',
              url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', // Sample PDF for testing
              type: 'pdf'
            }
          ];
          console.log('🚀 MEMBER DASHBOARD: Sample documents added for testing:', this.documents);
        }
      },
      error: (error: any) => {
        // Handle different error types gracefully
        if (error.status === 404) {
          console.log('🚀 MEMBER DASHBOARD: No membership applications found (expected behavior)');
        } else if (error.status === 0) {
          console.log('🚀 MEMBER DASHBOARD: Network connection issue - checking offline mode');
        } else if (error.status >= 500) {
          console.error('🚀 MEMBER DASHBOARD: Server error - please try again later');
        } else {
          console.error('🚀 MEMBER DASHBOARD: Error loading membership applications:', error);
        }
        this.documents = [];
      }
    });
  }

  // Helper method to determine document type from filename
  private getDocumentTypeFromName(filename: string): string {
    const extension = filename.toLowerCase().split('.').pop();
    if (extension && ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) {
      return 'image';
    } else if (extension === 'pdf') {
      return 'pdf';
    }
    return 'unknown';
  }

  // Navigate to account page for password change
  navigateToAccount(): void {
    this.router.navigate(['/member/account']);
  }

  // Document modal properties
  showDocumentsModal = false;

  viewDocuments(): void {
    this.loadDocuments();
    this.showDocumentsModal = true;
  }

  closeDocumentsModal(): void {
    this.showDocumentsModal = false;
  }

  // Scroll to dashboard content area (account for sidebar)
  scrollToDashboardContent(): void {
    setTimeout(() => {
      const dashboardContent = document.querySelector('.dashboard-content');
      if (dashboardContent) {
        console.log('🚀 MEMBER DASHBOARD: Scrolling to dashboard content area');
        dashboardContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        console.log('🚀 MEMBER DASHBOARD: Dashboard content element not found, using fallback scroll');
        // Fallback: scroll to top with offset for sidebar
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }
    }, 150);
  }

  getDocumentIcon(type: string): string {
    const iconMap: { [key: string]: string } = {
      'pdf': 'fa-file-pdf',
      'jpg': 'fa-file-image',
      'jpeg': 'fa-file-image',
      'png': 'fa-file-image',
      'gif': 'fa-file-image',
      'doc': 'fa-file-word',
      'docx': 'fa-file-word',
      'xls': 'fa-file-excel',
      'xlsx': 'fa-file-excel',
      'txt': 'fa-file-alt'
    };
    return iconMap[type.toLowerCase()] || 'fa-file';
  }

  downloadDocument(doc: Document): void {
    const link = document.createElement('a');
    link.href = doc.url;
    link.download = doc.name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  tot_bookings(): number {
    return this.bookings.length;
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  ngOnDestroy() {
    // Cleanup if needed when component is destroyed
  }
}


