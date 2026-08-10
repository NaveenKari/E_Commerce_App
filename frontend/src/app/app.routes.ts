import { Routes } from '@angular/router';
import { StorefrontShellComponent } from './layout/storefront-shell/storefront-shell.component';
import { AdminShellComponent } from './layout/admin-shell/admin-shell.component';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

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
      {
        path: 'checkout',
        canActivate: [authGuard],
        loadComponent: () => import('./features/storefront/checkout/checkout.component').then((m) => m.CheckoutComponent),
      },
      {
        path: 'checkout/confirmation',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/storefront/checkout/order-confirmation.component').then(
            (m) => m.OrderConfirmationComponent
          ),
      },
      {
        path: 'orders',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/storefront/order-history/order-history.component').then(
            (m) => m.OrderHistoryComponent
          ),
      },
      {
        path: 'orders/:id',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/storefront/order-detail/order-detail.component').then((m) => m.OrderDetailComponent),
      },
      {
        path: 'wishlist',
        canActivate: [authGuard],
        loadComponent: () => import('./features/storefront/wishlist/wishlist.component').then((m) => m.WishlistComponent),
      },
      {
        path: 'account',
        canActivate: [authGuard],
        loadComponent: () => import('./features/account/profile/profile.component').then((m) => m.ProfileComponent),
      },
      {
        path: 'account/addresses',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/account/addresses/addresses.component').then((m) => m.AddressesComponent),
      },
      {
        path: '**',
        loadComponent: () => import('./shared/components/not-found/not-found.component').then((m) => m.NotFoundComponent),
      },
    ],
  },
  {
    path: 'admin',
    component: AdminShellComponent,
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./features/admin/dashboard/dashboard.component').then((m) => m.AdminDashboardComponent),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./features/admin/categories/categories.component').then((m) => m.AdminCategoriesComponent),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./features/admin/products/products.component').then((m) => m.AdminProductsComponent),
      },
      {
        path: 'orders',
        loadComponent: () => import('./features/admin/orders/orders.component').then((m) => m.AdminOrdersComponent),
      },
    ],
  },
];
