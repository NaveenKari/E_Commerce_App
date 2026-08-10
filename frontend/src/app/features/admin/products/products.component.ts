import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { Product, ProductInput } from '../../../core/models/product.model';
import { Category } from '../../../core/models/category.model';
import { resolveImageUrl } from '../../../core/utils/image-url';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

const EMPTY_FORM: ProductInput = {
  productName: '',
  description: '',
  quantity: 0,
  price: 0,
  discount: 0,
  specialPrice: 0,
};

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [FormsModule, CurrencyPipe, ButtonComponent, LoadingSpinnerComponent, EmptyStateComponent],
  template: `
    <div class="p-8">
      <div class="mb-8 flex items-center justify-between">
        <h1 class="text-3xl">Products</h1>
        @if (!showForm()) {
          <app-button (click)="startCreate()">Add product</app-button>
        }
      </div>

      @if (showForm()) {
        <form class="card mb-8 flex flex-col gap-4 p-6" (ngSubmit)="onSubmit()">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="flex flex-col gap-1 sm:col-span-2">
              <label class="text-sm font-medium text-neutral-700">Product name</label>
              <input
                required
                name="productName"
                [(ngModel)]="form.productName"
                class="rounded-xl border border-neutral-300 px-4 py-2.5 focus:border-primary-500 focus:outline-none"
              />
            </div>

            @if (!editingId()) {
              <div class="flex flex-col gap-1">
                <label class="text-sm font-medium text-neutral-700">Category</label>
                <select
                  required
                  name="categoryId"
                  [(ngModel)]="selectedCategoryId"
                  class="rounded-xl border border-neutral-300 px-4 py-2.5 focus:border-primary-500 focus:outline-none"
                >
                  <option [ngValue]="null" disabled>Select a category</option>
                  @for (category of categories(); track category.categoryId) {
                    <option [ngValue]="category.categoryId">{{ category.categoryName }}</option>
                  }
                </select>
              </div>
            }

            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-neutral-700">Quantity in stock</label>
              <input
                required
                type="number"
                min="0"
                name="quantity"
                [(ngModel)]="form.quantity"
                class="rounded-xl border border-neutral-300 px-4 py-2.5 focus:border-primary-500 focus:outline-none"
              />
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-neutral-700">Price</label>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                name="price"
                [(ngModel)]="form.price"
                class="rounded-xl border border-neutral-300 px-4 py-2.5 focus:border-primary-500 focus:outline-none"
              />
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-neutral-700">Discount %</label>
              <input
                required
                type="number"
                min="0"
                max="100"
                name="discount"
                [(ngModel)]="form.discount"
                class="rounded-xl border border-neutral-300 px-4 py-2.5 focus:border-primary-500 focus:outline-none"
              />
            </div>

            <div class="flex flex-col gap-1 sm:col-span-2">
              <label class="text-sm font-medium text-neutral-700">Description</label>
              <textarea
                required
                minlength="6"
                rows="3"
                name="description"
                [(ngModel)]="form.description"
                class="rounded-xl border border-neutral-300 px-4 py-2.5 focus:border-primary-500 focus:outline-none"
              ></textarea>
            </div>
          </div>

          @if (errorMessage()) {
            <p class="text-sm text-red-600">{{ errorMessage() }}</p>
          }

          <div class="flex gap-3">
            <app-button type="submit" [disabled]="saving()">{{ editingId() ? 'Save changes' : 'Add product' }}</app-button>
            <app-button variant="secondary" (click)="cancelForm()">Cancel</app-button>
          </div>
        </form>
      }

      @if (loading()) {
        <app-loading-spinner />
      } @else if (products().length === 0 && !showForm()) {
        <app-empty-state title="No products yet" />
      } @else {
        <div class="card overflow-hidden">
          <table class="w-full text-left text-sm">
            <thead class="bg-neutral-50 text-neutral-500">
              <tr>
                <th class="px-4 py-3">Image</th>
                <th class="px-4 py-3">Name</th>
                <th class="px-4 py-3">Price</th>
                <th class="px-4 py-3">Stock</th>
                <th class="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (product of products(); track product.productId) {
                <tr class="border-t border-neutral-100">
                  <td class="px-4 py-3">
                    <img [src]="resolveImageUrl(product.image)" [alt]="product.productName" class="h-12 w-12 rounded-lg object-cover" />
                  </td>
                  <td class="px-4 py-3">{{ product.productName }}</td>
                  <td class="px-4 py-3">{{ product.specialPrice | currency }}</td>
                  <td class="px-4 py-3">{{ product.quantity }}</td>
                  <td class="px-4 py-3 text-right">
                    <label class="mr-4 cursor-pointer font-medium text-neutral-600 hover:text-neutral-800">
                      Upload image
                      <input type="file" accept="image/*" class="hidden" (change)="onImageSelected($event, product.productId)" />
                    </label>
                    <button type="button" class="mr-4 font-medium text-primary-600 hover:text-primary-700" (click)="startEdit(product)">
                      Edit
                    </button>
                    <button type="button" class="font-medium text-red-500 hover:text-red-600" (click)="deleteProduct(product.productId)">
                      Delete
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
})
export class AdminProductsComponent implements OnInit {
  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  loading = signal(true);
  saving = signal(false);
  showForm = signal(false);
  editingId = signal<number | null>(null);
  errorMessage = signal('');
  form: ProductInput = { ...EMPTY_FORM };
  selectedCategoryId: number | null = null;
  resolveImageUrl = resolveImageUrl;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
    this.categoryService.getCategories({ pageSize: 100 }).subscribe((res) => this.categories.set(res.categoryDTOList));
  }

  private fetchProducts(): void {
    this.loading.set(true);
    this.productService.getProducts({ pageSize: 100 }).subscribe({
      next: (res) => {
        this.products.set(res.productList);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  startCreate(): void {
    this.editingId.set(null);
    this.form = { ...EMPTY_FORM };
    this.selectedCategoryId = null;
    this.errorMessage.set('');
    this.showForm.set(true);
  }

  startEdit(product: Product): void {
    this.editingId.set(product.productId);
    const { productId, image, ...rest } = product;
    this.form = { ...rest };
    this.errorMessage.set('');
    this.showForm.set(true);
  }

  cancelForm(): void {
    this.showForm.set(false);
  }

  private computeSpecialPrice(): number {
    return this.form.price - (this.form.discount / 100) * this.form.price;
  }

  onSubmit(): void {
    const editingId = this.editingId();

    if (!editingId && !this.selectedCategoryId) {
      this.errorMessage.set('Please select a category.');
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');

    const payload: ProductInput = { ...this.form, specialPrice: this.computeSpecialPrice() };

    const request$ = editingId
      ? this.productService.updateProduct(editingId, payload)
      : this.productService.addProduct(this.selectedCategoryId!, payload);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.showForm.set(false);
        this.fetchProducts();
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMessage.set(err.error?.message || 'Could not save product. Check the fields and try again.');
      },
    });
  }

  deleteProduct(productId: number): void {
    this.productService.deleteProduct(productId).subscribe(() => this.fetchProducts());
  }

  onImageSelected(event: Event, productId: number): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.productService.uploadImage(productId, file).subscribe(() => this.fetchProducts());
  }
}
