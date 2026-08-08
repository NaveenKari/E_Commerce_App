import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, ButtonComponent, LoadingSpinnerComponent, EmptyStateComponent],
  template: `
    <div class="mx-auto max-w-4xl px-4 py-10">
      <h1 class="mb-8 text-4xl">Your cart</h1>

      @if (loading()) {
        <app-loading-spinner />
      } @else if (cart().products.length === 0) {
        <app-empty-state title="Your cart is empty" subtitle="Add something you love.">
        </app-empty-state>
        <div class="flex justify-center">
          <a routerLink="/products"><app-button>Start shopping</app-button></a>
        </div>
      } @else {
        <div class="flex flex-col gap-4">
          @for (item of cart().products; track item.productId) {
            <div class="card flex items-center gap-4 p-4">
              <img [src]="item.image" [alt]="item.productName" class="h-20 w-20 rounded-xl object-cover" />

              <div class="flex-1">
                <p class="font-display font-semibold text-neutral-900">{{ item.productName }}</p>
                <p class="text-sm text-neutral-500">{{ item.specialPrice | currency }} each</p>
              </div>

              <div class="flex items-center gap-3">
                <button
                  type="button"
                  class="h-8 w-8 rounded-full border border-neutral-300 text-lg leading-none disabled:opacity-40"
                  [disabled]="pendingProductId() === item.productId"
                  (click)="decrement(item.productId)"
                >
                  &minus;
                </button>
                <span class="w-6 text-center font-medium">{{ item.quantity }}</span>
                <button
                  type="button"
                  class="h-8 w-8 rounded-full border border-neutral-300 text-lg leading-none disabled:opacity-40"
                  [disabled]="pendingProductId() === item.productId"
                  (click)="increment(item.productId)"
                >
                  &plus;
                </button>
              </div>

              <p class="w-20 text-right font-display font-semibold">{{ item.specialPrice * item.quantity | currency }}</p>

              <button
                type="button"
                class="text-sm font-medium text-red-500 hover:text-red-600"
                (click)="remove(item.productId)"
              >
                Remove
              </button>
            </div>
          }
        </div>

        <div class="mt-8 flex items-center justify-between border-t border-neutral-200 pt-6">
          <span class="text-lg text-neutral-600">Total</span>
          <span class="font-display text-2xl font-bold">{{ cart().totalPrice | currency }}</span>
        </div>

        <div class="mt-6 flex justify-end">
          <a routerLink="/checkout"><app-button>Proceed to checkout</app-button></a>
        </div>
      }
    </div>
  `,
})
export class CartComponent implements OnInit {
  loading = signal(true);
  pendingProductId = signal<number | null>(null);

  cart;

  constructor(private cartService: CartService) {
    this.cart = this.cartService.cart;
  }

  ngOnInit(): void {
    this.cartService.loadCart().subscribe({
      next: () => this.loading.set(false),
      error: () => this.loading.set(false),
    });
  }

  increment(productId: number): void {
    this.pendingProductId.set(productId);
    this.cartService.updateQuantity(productId, 'add').subscribe({
      complete: () => this.pendingProductId.set(null),
    });
  }

  decrement(productId: number): void {
    this.pendingProductId.set(productId);
    this.cartService.updateQuantity(productId, 'delete').subscribe({
      complete: () => this.pendingProductId.set(null),
    });
  }

  remove(productId: number): void {
    this.cartService.removeFromCart(productId).subscribe();
  }
}
