import { Component, effect, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { ChatWidgetComponent } from '../../shared/components/chat-widget/chat-widget.component';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-storefront-shell',
  standalone: true,
  imports: [RouterLink, RouterOutlet, FormsModule, ChatWidgetComponent, IconComponent],
  template: `
    <div class="flex min-h-screen flex-col">
      <header class="border-b border-neutral-200 bg-white">
        <nav class="mx-auto max-w-6xl px-4 py-4">
          <div class="flex items-center justify-between gap-4">
            <a routerLink="/" class="font-display text-2xl font-bold text-primary-600">Bazaar</a>

            <form class="relative hidden flex-1 max-w-md md:block" (ngSubmit)="onSearch()">
              <app-icon
                name="search"
                svgClass="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
              />
              <input
                type="search"
                name="search"
                placeholder="Search products..."
                [(ngModel)]="searchTerm"
                class="w-full rounded-full border border-neutral-300 py-2 pl-9 pr-4 text-sm focus:border-primary-500 focus:outline-none"
              />
            </form>

            <!-- Desktop nav -->
            <div class="hidden items-center gap-6 text-sm font-medium text-neutral-700 md:flex">
              <a routerLink="/products" class="hover:text-primary-600">Shop</a>

              @if (auth.isAuthenticated()) {
                <a routerLink="/orders" class="hover:text-primary-600">Orders</a>
                <a routerLink="/account/addresses" class="hover:text-primary-600">Addresses</a>
                <a routerLink="/account" class="hover:text-primary-600">Account</a>
                @if (auth.isAdmin()) {
                  <a routerLink="/admin" class="hover:text-primary-600">Admin</a>
                }
                <a routerLink="/wishlist" class="relative flex items-center gap-1.5 hover:text-primary-600">
                  <app-icon name="heart" svgClass="h-4 w-4" />
                  Wishlist
                  @if (wishlistService.itemCount() > 0) {
                    <span
                      class="absolute -right-3 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary-500 text-[10px] font-bold text-white"
                    >
                      {{ wishlistService.itemCount() }}
                    </span>
                  }
                </a>
                <a routerLink="/cart" class="relative flex items-center gap-1.5 hover:text-primary-600">
                  <app-icon name="cart" svgClass="h-4 w-4" />
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

            <!-- Mobile/tablet: quick icons + menu toggle -->
            <div class="flex items-center gap-4 md:hidden">
              @if (auth.isAuthenticated()) {
                <a routerLink="/wishlist" class="relative text-neutral-700 hover:text-primary-600" aria-label="Wishlist">
                  <app-icon name="heart" svgClass="h-5 w-5" />
                  @if (wishlistService.itemCount() > 0) {
                    <span
                      class="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary-500 text-[10px] font-bold text-white"
                    >
                      {{ wishlistService.itemCount() }}
                    </span>
                  }
                </a>
                <a routerLink="/cart" class="relative text-neutral-700 hover:text-primary-600" aria-label="Cart">
                  <app-icon name="cart" svgClass="h-5 w-5" />
                  @if (cartService.itemCount() > 0) {
                    <span
                      class="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary-500 text-[10px] font-bold text-white"
                    >
                      {{ cartService.itemCount() }}
                    </span>
                  }
                </a>
              }
              <button
                type="button"
                class="text-neutral-700 hover:text-primary-600"
                (click)="mobileMenuOpen.set(!mobileMenuOpen())"
                [attr.aria-expanded]="mobileMenuOpen()"
                aria-label="Toggle menu"
              >
                <app-icon [name]="mobileMenuOpen() ? 'close' : 'menu'" svgClass="h-6 w-6" />
              </button>
            </div>
          </div>

          @if (mobileMenuOpen()) {
            <div class="mt-4 flex flex-col gap-1 border-t border-neutral-200 pt-4 text-sm font-medium text-neutral-700 md:hidden">
              <form class="relative mb-2" (ngSubmit)="onSearch(); closeMobileMenu()">
                <app-icon
                  name="search"
                  svgClass="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                />
                <input
                  type="search"
                  name="mobileSearch"
                  placeholder="Search products..."
                  [(ngModel)]="searchTerm"
                  class="w-full rounded-full border border-neutral-300 py-2 pl-9 pr-4 text-sm focus:border-primary-500 focus:outline-none"
                />
              </form>
              <a routerLink="/products" class="rounded-lg px-2 py-2 hover:bg-neutral-50" (click)="closeMobileMenu()">Shop</a>

              @if (auth.isAuthenticated()) {
                <a routerLink="/orders" class="rounded-lg px-2 py-2 hover:bg-neutral-50" (click)="closeMobileMenu()">Orders</a>
                <a routerLink="/account/addresses" class="rounded-lg px-2 py-2 hover:bg-neutral-50" (click)="closeMobileMenu()">
                  Addresses
                </a>
                <a routerLink="/account" class="rounded-lg px-2 py-2 hover:bg-neutral-50" (click)="closeMobileMenu()">Account</a>
                @if (auth.isAdmin()) {
                  <a routerLink="/admin" class="rounded-lg px-2 py-2 hover:bg-neutral-50" (click)="closeMobileMenu()">Admin</a>
                }
                <button
                  type="button"
                  class="rounded-lg px-2 py-2 text-left hover:bg-neutral-50"
                  (click)="signout(); closeMobileMenu()"
                >
                  Sign out
                </button>
              } @else {
                <a routerLink="/login" class="rounded-lg px-2 py-2 hover:bg-neutral-50" (click)="closeMobileMenu()">Sign in</a>
              }
            </div>
          }
        </nav>
      </header>

      <main class="flex-1">
        <router-outlet />
      </main>

      <footer class="border-t border-neutral-200 py-8 text-center text-sm text-neutral-500">
        Bazaar &copy; {{ year }}
      </footer>
    </div>

    <app-chat-widget />
  `,
})
export class StorefrontShellComponent {
  year = new Date().getFullYear();
  searchTerm = '';
  readonly mobileMenuOpen = signal(false);

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

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
