import { Routes } from "@angular/router";
import { AuthGuard } from "../../shared/guards/auth.guard";
import { AdminGuard } from "../../core/guards/admin.guard";


export const ADMIN_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardComponent),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'members',
    loadComponent: () => import('./pages/members/members').then(m => m.MembersComponent),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'blogs',
    loadComponent: () => import('./pages/blogs/blogs').then(m => m.BlogsComponent),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'members-management',
    loadComponent: () => import('./pages/members-management/members-management').then(m => m.MembersManagement),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'blogs-management',
    loadComponent: () => import('./pages/blogs-management/blogs-management').then(m => m.BlogsManagement),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'bookings-management',
  loadComponent: () => import('./pages/bookings-management/booking-management').then(m => m.BookingsManagementComponent),
  canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'key-management',
    loadComponent: () => import('./pages/key-management/key-management').then(m => m.KeyManagementComponent),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'create-admin',
    loadComponent: () => import('./pages/create-admin/create-admin').then(m => m.CreateAdminComponent),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'account',
    loadComponent: () => import('./pages/account/account').then(m => m.AccountComponent),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'signin',
    loadComponent: () => import('./pages/signin/signin').then(m => m.SigninComponent)
  },
  {
    path: 'members/edit/:id',
    loadComponent: () => import('./pages/add-edit-member/add-edit-member').then(m => m.AddEditMemberComponent),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'blogs/edit/:id',
    loadComponent: () => import('./pages/add-edit-blog/add-edit-blog').then(m => m.AddEditBlogComponent),
    canActivate: [AuthGuard, AdminGuard]
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
