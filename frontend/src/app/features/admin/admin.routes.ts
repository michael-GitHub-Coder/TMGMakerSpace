import { Routes } from "@angular/router";
import { AuthGuard } from "../../shared/guards/auth.guard";


export const ADMIN_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'members',
    loadComponent: () => import('./pages/members/members').then(m => m.MembersComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'blogs',
    loadComponent: () => import('./pages/blogs/blogs').then(m => m.BlogsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'members-management',
    loadComponent: () => import('./pages/members-management/members-management').then(m => m.MembersManagement),
    canActivate: [AuthGuard]
  },
  {
    path: 'blogs-management',
    loadComponent: () => import('./pages/blogs-management/blogs-management').then(m => m.BlogsManagement),
    canActivate: [AuthGuard]
  },
  {
    path: 'bookings-management',
  loadComponent: () => import('./pages/bookings-management/booking-management').then(m => m.BookingsManagementComponent),
  canActivate: [AuthGuard]
  },
  {
    path: 'key-management',
    loadComponent: () => import('./pages/key-management/key-management').then(m => m.KeyManagementComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'create-admin',
    loadComponent: () => import('./pages/create-admin/create-admin').then(m => m.CreateAdminComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'account',
    loadComponent: () => import('./pages/account/account').then(m => m.AccountComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'signin',
    loadComponent: () => import('./pages/signin/signin').then(m => m.SigninComponent)
  },
  {
    path: 'members/edit/:id',
    loadComponent: () => import('./pages/add-edit-member/add-edit-member').then(m => m.AddEditMemberComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'blogs/edit/:id',
    loadComponent: () => import('./pages/add-edit-blog/add-edit-blog').then(m => m.AddEditBlogComponent),
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
