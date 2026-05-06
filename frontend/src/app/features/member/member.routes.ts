import { Routes } from "@angular/router";

export const MEMBER_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/mdashboard').then(m => m.DashboardComponent)
},
  {
    path: 'account',
    loadComponent: () => import('./pages/account/account').then(m => m.AccountComponent)
},
  
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
