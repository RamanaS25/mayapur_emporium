import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'new-customer',
    pathMatch: 'full',
  },
  {
    path: 'new-customer',
    loadComponent: () => import('./pages/new-customer/new-customer.page').then( m => m.NewCustomerPage)
  },
  {
    path: 'customers',
    loadComponent: () => import('./pages/customers/customers.page').then( m => m.CustomersPage)
  },



];
