import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { Product } from '../../../core/models/product.model';
import { Category } from '../../../core/models/category.model';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

const CATEGORY_TILES = [
  'from-primary-500 to-primary-600',
  'from-accent-500 to-accent-600',
  'from-neutral-800 to-neutral-900',
  'from-amber-500 to-amber-600',
  'from-emerald-500 to-emerald-600',
  'from-primary-400 to-accent-500',
];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, FormsModule, ProductCardComponent, ButtonComponent, LoadingSpinnerComponent],
  template: `
    <!-- Hero -->
    <section class="relative overflow-hidden bg-neutral-900 text-white">
      <div class="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary-500/30 blur-3xl"></div>
      <div class="pointer-events-none absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl"></div>

      <div class="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-20 md:grid-cols-2 md:py-28">
        <div>
          <span class="badge bg-primary-500/20 text-primary-300">New season, new drops</span>
          <h1 class="mt-5 text-5xl leading-[1.05] md:text-6xl">Bold looks.<br />Better prices.</h1>
          <p class="mt-5 max-w-md text-lg text-neutral-300">
            Fresh drops across beauty, fragrance, home and more &mdash; curated daily, priced to move.
          </p>
          <div class="mt-8 flex flex-wrap gap-4">
            <a routerLink="/products"><app-button>Shop the collection</app-button></a>
            <a routerLink="/products" [queryParams]="{ sortBy: 'discount', sortOrder: 'desc' }">
              <app-button variant="secondary" customClass="!border-white/30 !bg-transparent !text-white hover:!bg-white/10">
                View today's deals
              </app-button>
            </a>
          </div>
        </div>

        <div class="relative hidden md:block">
          <div class="grid grid-cols-2 gap-4">
            @for (product of heroProducts(); track product.productId) {
              <a
                [routerLink]="['/products', product.productId]"
                class="group overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 transition hover:ring-primary-400"
              >
                <div class="aspect-square overflow-hidden">
                  <img
                    [src]="product.image"
                    [alt]="product.productName"
                    class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </a>
            }
          </div>
        </div>
      </div>
    </section>

    <!-- Trust bar -->
    <section class="border-b border-neutral-200 bg-white">
      <div class="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 sm:grid-cols-4">
        @for (item of trustItems; track item.title) {
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600" [innerHTML]="item.icon"></div>
            <div>
              <p class="text-sm font-semibold text-neutral-900">{{ item.title }}</p>
              <p class="text-xs text-neutral-500">{{ item.subtitle }}</p>
            </div>
          </div>
        }
      </div>
    </section>

    <!-- Shop by category -->
    @if (categories().length > 0) {
      <section class="mx-auto max-w-6xl px-4 py-16">
        <h2 class="mb-8 text-3xl">Shop by category</h2>
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          @for (category of categories(); track category.categoryId; let i = $index) {
            <a
              [routerLink]="['/products']"
              [queryParams]="{ category: category.categoryId }"
              class="group flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl bg-gradient-to-br p-4 text-center text-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              [class]="tileClass(i)"
            >
              <span class="font-display text-lg font-semibold leading-tight">{{ category.categoryName }}</span>
              <span class="text-xs text-white/80 opacity-0 transition group-hover:opacity-100">Shop now &rarr;</span>
            </a>
          }
        </div>
      </section>
    }

    <!-- Promo banner -->
    <section class="mx-auto max-w-6xl px-4 pb-4">
      <div class="flex flex-col items-center justify-between gap-4 rounded-2xl bg-accent-600 px-8 py-8 text-white sm:flex-row">
        <div>
          <p class="font-display text-2xl font-bold">Deals up to 30% off</p>
          <p class="text-accent-100">Limited-time prices across beauty, home and fragrance.</p>
        </div>
        <a routerLink="/products" [queryParams]="{ sortBy: 'discount', sortOrder: 'desc' }">
          <app-button customClass="!bg-white !text-accent-700 hover:!bg-accent-50">Shop deals</app-button>
        </a>
      </div>
    </section>

    <!-- New arrivals -->
    <section class="mx-auto max-w-6xl px-4 py-16">
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-3xl">New arrivals</h2>
        <a routerLink="/products" class="text-sm font-semibold text-primary-600">View all &rarr;</a>
      </div>

      @if (loading()) {
        <app-loading-spinner />
      } @else {
        <div class="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          @for (product of newArrivals(); track product.productId) {
            <app-product-card [product]="product" />
          }
        </div>
      }
    </section>

    <!-- Best deals -->
    @if (bestDeals().length > 0) {
      <section class="bg-neutral-50 py-16">
        <div class="mx-auto max-w-6xl px-4">
          <div class="mb-6 flex items-center justify-between">
            <h2 class="text-3xl">Best deals</h2>
            <a routerLink="/products" [queryParams]="{ sortBy: 'discount', sortOrder: 'desc' }" class="text-sm font-semibold text-primary-600">
              View all &rarr;
            </a>
          </div>

          <div class="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            @for (product of bestDeals(); track product.productId) {
              <app-product-card [product]="product" />
            }
          </div>
        </div>
      </section>
    }

    <!-- Newsletter -->
    <section class="mx-auto max-w-6xl px-4 py-16">
      <div class="flex flex-col items-center gap-4 rounded-2xl bg-neutral-900 px-8 py-12 text-center text-white">
        <h2 class="text-3xl">Get 10% off your first order</h2>
        <p class="max-w-md text-neutral-300">Sign up for restock alerts, new drops and member-only deals.</p>
        <form class="mt-2 flex w-full max-w-md gap-3" (ngSubmit)="onSubscribe()">
          <input
            type="email"
            name="email"
            required
            placeholder="you@example.com"
            [(ngModel)]="newsletterEmail"
            class="flex-1 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-white placeholder-neutral-400 focus:border-primary-400 focus:outline-none"
          />
          <app-button type="submit">{{ subscribed() ? 'Subscribed!' : 'Sign up' }}</app-button>
        </form>
      </div>
    </section>
  `,
})
export class HomeComponent implements OnInit {
  categories = signal<Category[]>([]);
  heroProducts = signal<Product[]>([]);
  newArrivals = signal<Product[]>([]);
  bestDeals = signal<Product[]>([]);
  loading = signal(true);

  newsletterEmail = '';
  subscribed = signal(false);

  trustItems = [
    {
      title: 'Free shipping',
      subtitle: 'On orders over $50',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.5"/><circle cx="17.5" cy="18" r="1.5"/></svg>',
    },
    {
      title: 'Secure payment',
      subtitle: '100% protected',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/></svg>',
    },
    {
      title: 'Easy returns',
      subtitle: '30-day window',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h5M4 9a8 8 0 1 1 2 5.3"/></svg>',
    },
    {
      title: '24/7 support',
      subtitle: "We're here to help",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18v3m-7-3a2 2 0 002 2h10a2 2 0 002-2v-3a7 7 0 10-14 0z"/></svg>',
    },
  ];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.categoryService.getCategories({ pageSize: 6 }).subscribe((res) => this.categories.set(res.categoryDTOList));

    this.productService.getProducts({ pageSize: 4, sortBy: 'productId', sortOrder: 'desc' }).subscribe((res) => this.heroProducts.set(res.productList));

    this.productService.getProducts({ pageSize: 8, sortBy: 'productId', sortOrder: 'desc' }).subscribe({
      next: (res) => {
        this.newArrivals.set(res.productList);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });

    this.productService.getProducts({ pageSize: 8, sortBy: 'discount', sortOrder: 'desc' }).subscribe((res) => this.bestDeals.set(res.productList));
  }

  tileClass(index: number): string {
    return CATEGORY_TILES[index % CATEGORY_TILES.length];
  }

  onSubscribe(): void {
    if (!this.newsletterEmail.trim()) return;
    this.subscribed.set(true);
  }
}
