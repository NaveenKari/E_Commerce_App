import { Component, Input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Product } from '../../../core/models/product.model';
import { BadgeComponent } from '../badge/badge.component';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { resolveImageUrl } from '../../../core/utils/image-url';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, BadgeComponent, CurrencyPipe, DecimalPipe],
  template: `
    <div class="card group flex flex-col overflow-hidden">
      <a [routerLink]="['/products', product.productId]" class="relative block aspect-square overflow-hidden bg-neutral-100">
        <img
          [src]="imageUrl"
          [alt]="product.productName"
          class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        @if (product.discount > 0) {
          <app-badge variant="sale" class="absolute left-3 top-3">-{{ product.discount | number: '1.0-0' }}%</app-badge>
        }
        <button
          type="button"
          class="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-neutral-500 shadow-sm transition hover:text-primary-600"
          [class.text-primary-600]="isSaved"
          (click)="onToggleWishlist($event)"
          [attr.aria-label]="isSaved ? 'Remove from wishlist' : 'Save to wishlist'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" [attr.fill]="isSaved ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 21s-7.5-4.6-10-9.1C.4 8.4 2 5 5.5 5c2 0 3.5 1.2 4.5 2.6C11 6.2 12.5 5 14.5 5 18 5 19.6 8.4 22 11.9 19.5 16.4 12 21 12 21z"/>
          </svg>
        </button>
      </a>

      <div class="flex flex-1 flex-col gap-2 p-4">
        <a [routerLink]="['/products', product.productId]" class="font-display font-semibold text-neutral-900 hover:text-primary-600">
          {{ product.productName }}
        </a>

        <div class="mt-auto flex items-center gap-2 pt-2">
          <span class="font-display text-lg font-bold text-neutral-900">{{ product.specialPrice | currency }}</span>
          @if (product.discount > 0) {
            <span class="text-sm text-neutral-400 line-through">{{ product.price | currency }}</span>
          }
        </div>

        <button
          type="button"
          class="btn-primary mt-2 w-full py-2 text-sm"
          [disabled]="product.quantity === 0 || adding()"
          [class.opacity-50]="product.quantity === 0"
          (click)="onAddToCart()"
        >
          {{ product.quantity === 0 ? 'Out of stock' : added() ? 'Added!' : 'Add to cart' }}
        </button>
      </div>
    </div>
  `,
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;

  adding = signal(false);
  added = signal(false);
  wishlistPending = signal(false);

  get imageUrl(): string {
    return resolveImageUrl(this.product.image);
  }

  get isSaved(): boolean {
    return this.wishlistService.isSaved(this.product.productId);
  }

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService,
    private authService: AuthService,
    private router: Router
  ) {}

  onAddToCart(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    this.adding.set(true);
    this.cartService.addOrIncrement(this.product.productId).subscribe({
      next: () => {
        this.adding.set(false);
        this.added.set(true);
        setTimeout(() => this.added.set(false), 1500);
      },
      error: () => this.adding.set(false),
    });
  }

  onToggleWishlist(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    if (this.wishlistPending()) return;

    this.wishlistPending.set(true);
    const request$ = this.isSaved
      ? this.wishlistService.remove(this.product.productId)
      : this.wishlistService.add(this.product.productId);

    request$.subscribe({
      next: () => this.wishlistPending.set(false),
      error: () => this.wishlistPending.set(false),
    });
  }
}
