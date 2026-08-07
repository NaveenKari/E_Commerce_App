import { Routes } from '@angular/router';
import { StorefrontShellComponent } from './layout/storefront-shell/storefront-shell.component';

export const routes: Routes = [
  {
    path: '',
    component: StorefrontShellComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./features/storefront/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
      },
      {
        path: 'not-authorized',
        loadComponent: () =>
          import('./shared/components/not-authorized/not-authorized.component').then(
            (m) => m.NotAuthorizedComponent
          ),
      },
    ],
  },
];
