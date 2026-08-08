import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { Product } from '../../../core/models/product.model';
import { Category } from '../../../core/models/category.model';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

const PAGE_SIZE = 12;

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterLink, ProductCardComponent, LoadingSpinnerComponent, EmptyStateComponent, PaginationComponent],
  template: `
    <div class="mx-auto max-w-6xl px-4 py-10">
      <div class="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 class="text-4xl">{{ heading() }}</h1>

        <div class="flex flex-wrap gap-2">
          <a
            routerLink="/products"
            class="rounded-full px-4 py-1.5 text-sm font-medium"
            [class.bg-primary-500]="!activeCategoryId()"
            [class.text-white]="!activeCategoryId()"
            [class.bg-neutral-100]="activeCategoryId()"
            [class.text-neutral-700]="activeCategoryId()"
          >
            All
          </a>
          @for (category of categories(); track category.categoryId) {
            <a
              [routerLink]="['/products']"
              [queryParams]="{ category: category.categoryId }"
              class="rounded-full px-4 py-1.5 text-sm font-medium"
              [class.bg-primary-500]="activeCategoryId() === category.categoryId"
              [class.text-white]="activeCategoryId() === category.categoryId"
              [class.bg-neutral-100]="activeCategoryId() !== category.categoryId"
              [class.text-neutral-700]="activeCategoryId() !== category.categoryId"
            >
              {{ category.categoryName }}
            </a>
          }
        </div>
      </div>

      @if (loading()) {
        <app-loading-spinner />
      } @else if (products().length === 0) {
        <app-empty-state title="No products found" subtitle="Try a different category or search term." />
      } @else {
        <div class="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          @for (product of products(); track product.productId) {
            <app-product-card [product]="product" />
          }
        </div>

        <app-pagination [pageNumber]="pageNumber()" [totalPages]="totalPages()" (pageChange)="onPageChange($event)" />
      }
    </div>
  `,
})
export class ProductListComponent implements OnInit {
  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  loading = signal(true);
  pageNumber = signal(0);
  totalPages = signal(0);
  activeCategoryId = signal<number | null>(null);
  searchKeyword = signal<string | null>(null);

  heading = () => (this.searchKeyword() ? `Results for "${this.searchKeyword()}"` : 'Shop all products');

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoryService.getCategories({ pageSize: 50 }).subscribe((res) => this.categories.set(res.categoryDTOList));

    this.route.queryParamMap.pipe(switchMap((params) => this.loadProducts(params))).subscribe();
  }

  private loadProducts(params: import('@angular/router').ParamMap) {
    const categoryParam = params.get('category');
    const keyword = params.get('q');
    const page = Number(params.get('page') ?? 0);

    this.activeCategoryId.set(categoryParam ? Number(categoryParam) : null);
    this.searchKeyword.set(keyword);
    this.pageNumber.set(page);
    this.loading.set(true);

    const pageParams = { pageNumber: page, pageSize: PAGE_SIZE };

    const request$ = keyword
      ? this.productService.searchProducts(keyword, pageParams)
      : categoryParam
        ? this.productService.getProductsByCategory(Number(categoryParam), pageParams)
        : this.productService.getProducts(pageParams);

    request$.subscribe({
      next: (res) => {
        this.products.set(res.productList);
        this.totalPages.set(res.totalPages);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });

    return request$;
  }

  onPageChange(page: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page },
      queryParamsHandling: 'merge',
    });
  }
}
