import { Routes } from '@angular/router';
import { StorefrontShellComponent } from './layout/storefront-shell/storefront-shell.component';
import { authGuard } from './core/guards/auth.guard';

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
      {
        path: 'products',
        loadComponent: () =>
          import('./features/storefront/product-list/product-list.component').then((m) => m.ProductListComponent),
      },
      {
        path: 'products/:id',
        loadComponent: () =>
          import('./features/storefront/product-detail/product-detail.component').then(
            (m) => m.ProductDetailComponent
          ),
      },
      {
        path: 'cart',
        canActivate: [authGuard],
        loadComponent: () => import('./features/storefront/cart/cart.component').then((m) => m.CartComponent),
      },
    ],
  },
];
