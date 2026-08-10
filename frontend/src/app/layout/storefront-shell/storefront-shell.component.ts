import { Component, effect } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';

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
              <a routerLink="/account/addresses" class="hover:text-primary-600">Addresses</a>
              <a routerLink="/account" class="hover:text-primary-600">Account</a>
              @if (auth.isAdmin()) {
                <a routerLink="/admin" class="hover:text-primary-600">Admin</a>
              }
              <a routerLink="/wishlist" class="relative hover:text-primary-600">
                Wishlist
                @if (wishlistService.itemCount() > 0) {
                  <span
                    class="absolute -right-3 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary-500 text-[10px] font-bold text-white"
                  >
                    {{ wishlistService.itemCount() }}
                  </span>
                }
              </a>
              <a routerLink="/cart" class="relative hover:text-primary-600">
                Cart
                @if (cartService.itemCount() > 0) {
                  <span
                    class="absolute -right-3 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary-500 text-[10px] font-bold text-white"
                  >
                    {{ cartService.itemCount() }}
                  </span>
                }
              </a>
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
    public cartService: CartService,
    public wishlistService: WishlistService,
    private router: Router
  ) {
    effect(() => {
      if (this.auth.isAuthenticated()) {
        this.cartService.loadCart().subscribe();
        this.wishlistService.load().subscribe();
      } else if (this.auth.hydrated()) {
        this.cartService.clearLocalState();
        this.wishlistService.clearLocalState();
      }
    });
  }

  signout(): void {
    this.auth.signout().subscribe(() => this.router.navigateByUrl('/login'));
  }

  onSearch(): void {
    const term = this.searchTerm.trim();
    if (term) {
      this.router.navigate(['/products'], { queryParams: { q: term } });
    }
  }
}
