import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { Product } from '../../../core/models/product.model';
import { Category } from '../../../core/models/category.model';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ProductCardComponent, ButtonComponent, LoadingSpinnerComponent],
  template: `
    <section class="bg-neutral-900 text-white">
      <div class="mx-auto max-w-6xl px-4 py-24 text-center">
        <h1 class="text-6xl">Bold looks. Better prices.</h1>
        <p class="mx-auto mt-4 max-w-xl text-lg text-neutral-300">
          Fresh drops across beauty, fragrance, home and more &mdash; curated daily.
        </p>
        <a routerLink="/products">
          <app-button class="mt-8">Shop the collection</app-button>
        </a>
      </div>
    </section>

    @if (categories().length > 0) {
      <section class="mx-auto max-w-6xl px-4 py-12">
        <h2 class="mb-6 text-3xl">Shop by category</h2>
        <div class="flex flex-wrap gap-3">
          @for (category of categories(); track category.categoryId) {
            <a
              [routerLink]="['/products']"
              [queryParams]="{ category: category.categoryId }"
              class="rounded-full bg-accent-50 px-5 py-2 text-sm font-semibold text-accent-700 hover:bg-accent-100"
            >
              {{ category.categoryName }}
            </a>
          }
        </div>
      </section>
    }

    <section class="mx-auto max-w-6xl px-4 pb-16">
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-3xl">Featured products</h2>
        <a routerLink="/products" class="text-sm font-semibold text-primary-600">View all &rarr;</a>
      </div>

      @if (loading()) {
        <app-loading-spinner />
      } @else {
        <div class="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          @for (product of featuredProducts(); track product.productId) {
            <app-product-card [product]="product" />
          }
        </div>
      }
    </section>
  `,
})
export class HomeComponent implements OnInit {
  categories = signal<Category[]>([]);
  featuredProducts = signal<Product[]>([]);
  loading = signal(true);

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.categoryService.getCategories({ pageSize: 6 }).subscribe((res) => this.categories.set(res.categoryDTOList));

    this.productService.getProducts({ pageSize: 8, sortBy: 'productId', sortOrder: 'desc' }).subscribe({
      next: (res) => {
        this.featuredProducts.set(res.productList);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
