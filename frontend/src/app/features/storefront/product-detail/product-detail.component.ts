import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { switchMap } from 'rxjs';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product } from '../../../core/models/product.model';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DecimalPipe, BadgeComponent, ButtonComponent, LoadingSpinnerComponent, EmptyStateComponent],
  template: `
    @if (loading()) {
      <app-loading-spinner />
    } @else if (!product()) {
      <app-empty-state title="Product not found" subtitle="It may have been removed." />
    } @else {
      <div class="mx-auto max-w-5xl px-4 py-10">
        <a routerLink="/products" class="text-sm font-medium text-neutral-500 hover:text-primary-600">&larr; Back to shop</a>

        <div class="mt-6 grid grid-cols-1 gap-10 md:grid-cols-2">
          <div class="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100">
            <img [src]="product()!.image" [alt]="product()!.productName" class="h-full w-full object-cover" />
            @if (product()!.discount > 0) {
              <app-badge variant="sale" class="absolute left-4 top-4">-{{ product()!.discount | number: '1.0-0' }}%</app-badge>
            }
          </div>

          <div class="flex flex-col gap-4">
            <h1 class="text-4xl">{{ product()!.productName }}</h1>

            <div class="flex items-center gap-3">
              <span class="font-display text-3xl font-bold text-neutral-900">{{ product()!.specialPrice | currency }}</span>
              @if (product()!.discount > 0) {
                <span class="text-lg text-neutral-400 line-through">{{ product()!.price | currency }}</span>
              }
            </div>

            @if (product()!.quantity === 0) {
              <app-badge variant="danger" class="w-fit">Out of stock</app-badge>
            } @else if (product()!.quantity < 10) {
              <app-badge variant="sale" class="w-fit">Only {{ product()!.quantity }} left</app-badge>
            }

            <p class="leading-relaxed text-neutral-600">{{ product()!.description }}</p>

            <app-button [disabled]="product()!.quantity === 0 || adding()" class="mt-4 w-fit" (click)="onAddToCart()">
              {{ product()!.quantity === 0 ? 'Out of stock' : added() ? 'Added!' : 'Add to cart' }}
            </app-button>
          </div>
        </div>
      </div>
    }
  `,
})
export class ProductDetailComponent implements OnInit {
  product = signal<Product | null>(null);
  loading = signal(true);
  adding = signal(false);
  added = signal(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(switchMap((params) => this.productService.getProductById(Number(params.get('id')))))
      .subscribe({
        next: (product) => {
          this.product.set(product);
          this.loading.set(false);
        },
        error: () => {
          this.product.set(null);
          this.loading.set(false);
        },
      });
  }

  onAddToCart(): void {
    const product = this.product();
    if (!product) return;

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    this.adding.set(true);
    this.cartService.addOrIncrement(product.productId).subscribe({
      next: () => {
        this.adding.set(false);
        this.added.set(true);
        setTimeout(() => this.added.set(false), 1500);
      },
      error: () => this.adding.set(false),
    });
  }
}
