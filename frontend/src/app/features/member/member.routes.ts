import { Routes } from "@angular/router";

export const MEMBER_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/mdashboard').then(m => m.DashboardComponent2)
},
  
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
