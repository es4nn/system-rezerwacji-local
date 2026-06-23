import { Routes } from '@angular/router';
import { authGuard, authMatchGuard } from './guards/auth.guard';
import { RoomList } from './components/room-list/room-list';

export const routes: Routes = [
  { path: '', component: RoomList },
  { path: 'login', loadComponent: () => import('./components/login/login').then((m) => m.Login) },
  { path: 'register', loadComponent: () => import('./components/register/register').then((m) => m.Register) },
  { path: 'about', loadComponent: () => import('./components/about/about').then((m) => m.About) },
  { path: 'reviews', loadComponent: () => import('./components/reviews/reviews').then((m) => m.Reviews) },
  { path: 'contact', loadComponent: () => import('./components/contact/contact').then((m) => m.Contact) },
  { path: 'my-bookings', loadComponent: () => import('./components/booking-list/booking-list').then((m) => m.BookingList) },
  { path: 'terms', loadComponent: () => import('./components/terms/terms').then((m) => m.TermsComponent) },
  { path: 'regulamin', loadComponent: () => import('./components/terms/terms').then((m) => m.TermsComponent) },
  { path: 'privacy', loadComponent: () => import('./components/privacy/privacy').then((m) => m.PrivacyComponent) },
  { path: 'polityka-prywatnosci', loadComponent: () => import('./components/privacy/privacy').then((m) => m.PrivacyComponent) },
  {
    path: 'admin',
    loadChildren: () => import('./components/admin-dashboard/admin.routes').then((m) => m.ADMIN_ROUTES),
    canMatch: [authMatchGuard],
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '' }
];
