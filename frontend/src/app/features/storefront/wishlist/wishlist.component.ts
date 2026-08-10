import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { WishlistService } from '../../../core/services/wishlist.service';
import { CartService } from '../../../core/services/cart.service';
import { Product } from '../../../core/models/product.model';
import { resolveImageUrl } from '../../../core/utils/image-url';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, ButtonComponent, LoadingSpinnerComponent, EmptyStateComponent],
  template: `
    <div class="mx-auto max-w-4xl px-4 py-10">
      <h1 class="mb-8 text-4xl">Your wishlist</h1>

      @if (loading()) {
        <app-loading-spinner />
      } @else if (items().length === 0) {
        <app-empty-state title="Your wishlist is empty" subtitle="Save products you love for later." />
        <div class="flex justify-center">
          <a routerLink="/products"><app-button>Start shopping</app-button></a>
        </div>
      } @else {
        <div class="flex flex-col gap-4">
          @for (item of items(); track item.productId) {
            <div class="card flex items-center gap-4 p-4">
              <a [routerLink]="['/products', item.productId]">
                <img [src]="resolveImageUrl(item.image)" [alt]="item.productName" class="h-20 w-20 rounded-xl object-cover" />
              </a>

              <div class="flex-1">
                <a [routerLink]="['/products', item.productId]" class="font-display font-semibold text-neutral-900 hover:text-primary-600">
                  {{ item.productName }}
                </a>
                <p class="text-sm text-neutral-500">{{ item.specialPrice | currency }}</p>
              </div>

              <app-button
                variant="secondary"
                [disabled]="item.quantity === 0 || movingId() === item.productId"
                (click)="moveToCart(item)"
              >
                {{ item.quantity === 0 ? 'Out of stock' : 'Move to cart' }}
              </app-button>

              <button type="button" class="text-sm font-medium text-red-500 hover:text-red-600" (click)="remove(item.productId)">
                Remove
              </button>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class WishlistComponent implements OnInit {
  loading = signal(true);
  movingId = signal<number | null>(null);
  resolveImageUrl = resolveImageUrl;

  items;

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService
  ) {
    this.items = this.wishlistService.items;
  }

  ngOnInit(): void {
    this.wishlistService.load().subscribe({
      next: () => this.loading.set(false),
      error: () => this.loading.set(false),
    });
  }

  moveToCart(item: Product): void {
    this.movingId.set(item.productId);
    this.cartService.addOrIncrement(item.productId).subscribe({
      next: () => {
        this.wishlistService.remove(item.productId).subscribe({
          complete: () => this.movingId.set(null),
        });
      },
      error: () => this.movingId.set(null),
    });
  }

  remove(productId: number): void {
    this.wishlistService.remove(productId).subscribe();
  }
}
