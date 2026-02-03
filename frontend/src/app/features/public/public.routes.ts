import { Routes } from "@angular/router";

export const PUBLIC_ROUTES: Routes = [
    {
        path: 'home',
        loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent)
    },
    {
        path: 'about',
        loadComponent: () => import('./pages/about/about').then(m => m.AboutComponent)
    },
    {
        path: 'services',
        loadComponent: () => import('./pages/services/services').then(m => m.ServicesComponent)
    },
    {
        path: 'members',
        loadComponent: () => import('./pages/members/members').then(m => m.MembersComponent)
    },
    {
        path: 'blog',
        loadComponent: () => import('./pages/blog/blog').then(m => m.BlogComponent)
    },
    {
        path: 'contact',
        loadComponent: () => import('./pages/contact/contact').then(m => m.ContactComponent)
    },
    {
        path: 'booking',
        loadComponent: () => import('./pages/booking/booking').then(m => m.BookingComponent)
    },
    {
        path: 'apply',
        loadComponent: () => import('../Application/Application').then(m => m.ApplicationComponent)
    },

    // {
    //     path: 'sign-in',
    //     loadComponent: () => import('./pages/signin/Signin').then(m => m.SigninComponent)
    // },
    { path: '', redirectTo: 'home', pathMatch: 'full' }
];  