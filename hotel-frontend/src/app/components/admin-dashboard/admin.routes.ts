import { Routes } from '@angular/router';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { AdminDashboard } from './admin-dashboard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    providers: [provideCharts(withDefaultRegisterables())],
    children: [
      { path: '', component: AdminDashboard },
      { path: 'rezerwacje', component: AdminDashboard }
    ]
  }
];
