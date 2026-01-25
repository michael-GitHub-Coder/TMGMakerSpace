import { Routes } from '@angular/router';
import { PUBLIC_ROUTES } from './features/public/public.routes';
import { ADMIN_ROUTES } from './features/admin/admin.routes';
import { AuthGuard } from './shared/guards/auth.guard';
import { MEMBER_ROUTES } from './features/member/member.routes';



export const routes: Routes = [
  {
    path: '',
    children: PUBLIC_ROUTES
  },
  {
    path: 'signin',
    loadComponent: () => import('./features/admin/pages/signin/signin').then(m => m.SigninComponent)
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    data: { role: 'admin' },
    children: ADMIN_ROUTES
  },
  {
    path: 'member',
    canActivate: [AuthGuard],
    data: { role: 'member' },
    children: MEMBER_ROUTES
  },
  { path: '**', redirectTo: '' }
];

