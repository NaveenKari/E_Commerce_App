import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Product } from '../../../core/models/product.model';
import { BadgeComponent } from '../badge/badge.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, BadgeComponent, CurrencyPipe, DecimalPipe],
  template: `
    <div class="card group flex flex-col overflow-hidden">
      <a [routerLink]="['/products', product.productId]" class="relative block aspect-square overflow-hidden bg-neutral-100">
        <img
          [src]="product.image"
          [alt]="product.productName"
          class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        @if (product.discount > 0) {
          <app-badge variant="sale" class="absolute left-3 top-3">-{{ product.discount | number: '1.0-0' }}%</app-badge>
        }
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
          [disabled]="product.quantity === 0"
          [class.opacity-50]="product.quantity === 0"
          (click)="addToCart.emit(product)"
        >
          {{ product.quantity === 0 ? 'Out of stock' : 'Add to cart' }}
        </button>
      </div>
    </div>
  `,
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Output() addToCart = new EventEmitter<Product>();
}
