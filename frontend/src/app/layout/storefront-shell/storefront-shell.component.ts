import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-storefront-shell',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  template: `
    <div class="flex min-h-screen flex-col">
      <header class="border-b border-neutral-200 bg-white">
        <nav class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <a routerLink="/" class="font-display text-2xl font-bold text-primary-600">Bazaar</a>

          <div class="flex items-center gap-6 text-sm font-medium text-neutral-700">
            <a routerLink="/products" class="hover:text-primary-600">Shop</a>

            @if (auth.isAuthenticated()) {
              <a routerLink="/orders" class="hover:text-primary-600">Orders</a>
              @if (auth.isAdmin()) {
                <a routerLink="/admin" class="hover:text-primary-600">Admin</a>
              }
              <a routerLink="/cart" class="hover:text-primary-600">Cart</a>
              <button type="button" class="hover:text-primary-600" (click)="signout()">Sign out</button>
            } @else {
              <a routerLink="/login" class="hover:text-primary-600">Sign in</a>
            }
          </div>
        </nav>
      </header>

      <main class="flex-1">
        <router-outlet />
      </main>

      <footer class="border-t border-neutral-200 py-8 text-center text-sm text-neutral-500">
        Bazaar &copy; {{ year }}
      </footer>
    </div>
  `,
})
export class StorefrontShellComponent {
  year = new Date().getFullYear();

  constructor(public auth: AuthService) {}

  signout(): void {
    this.auth.signout().subscribe();
  }
}
