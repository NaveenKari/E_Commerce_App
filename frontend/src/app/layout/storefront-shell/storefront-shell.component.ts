import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-storefront-shell',
  standalone: true,
  imports: [RouterLink, RouterOutlet, FormsModule],
  template: `
    <div class="flex min-h-screen flex-col">
      <header class="border-b border-neutral-200 bg-white">
        <nav class="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4">
          <a routerLink="/" class="font-display text-2xl font-bold text-primary-600">Bazaar</a>

          <form class="hidden flex-1 max-w-md sm:block" (ngSubmit)="onSearch()">
            <input
              type="search"
              name="search"
              placeholder="Search products..."
              [(ngModel)]="searchTerm"
              class="w-full rounded-full border border-neutral-300 px-4 py-2 text-sm focus:border-primary-500 focus:outline-none"
            />
          </form>

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
  searchTerm = '';

  constructor(
    public auth: AuthService,
    private router: Router
  ) {}

  signout(): void {
    this.auth.signout().subscribe();
  }

  onSearch(): void {
    const term = this.searchTerm.trim();
    if (term) {
      this.router.navigate(['/products'], { queryParams: { q: term } });
    }
  }
}
