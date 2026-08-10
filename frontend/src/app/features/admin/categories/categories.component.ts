import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.model';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [FormsModule, ButtonComponent, LoadingSpinnerComponent, EmptyStateComponent],
  template: `
    <div class="p-8">
      <h1 class="mb-8 text-3xl">Categories</h1>

      <form class="card mb-8 flex items-end gap-4 p-6" (ngSubmit)="onSubmit()">
        <div class="flex flex-1 flex-col gap-1">
          <label class="text-sm font-medium text-neutral-700">{{ editingId() ? 'Rename category' : 'New category name' }}</label>
          <input
            required
            name="categoryName"
            [(ngModel)]="categoryName"
            class="rounded-xl border border-neutral-300 px-4 py-2.5 focus:border-primary-500 focus:outline-none"
          />
        </div>
        <app-button type="submit" [disabled]="saving()">{{ editingId() ? 'Save' : 'Add' }}</app-button>
        @if (editingId()) {
          <app-button variant="secondary" (click)="cancelEdit()">Cancel</app-button>
        }
      </form>

      @if (errorMessage()) {
        <p class="mb-4 text-sm text-red-600">{{ errorMessage() }}</p>
      }

      @if (loading()) {
        <app-loading-spinner />
      } @else if (categories().length === 0) {
        <app-empty-state title="No categories yet" />
      } @else {
        <div class="card overflow-hidden">
          <table class="w-full text-left text-sm">
            <thead class="bg-neutral-50 text-neutral-500">
              <tr>
                <th class="px-4 py-3">Name</th>
                <th class="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (category of categories(); track category.categoryId) {
                <tr class="border-t border-neutral-100">
                  <td class="px-4 py-3">{{ category.categoryName }}</td>
                  <td class="px-4 py-3 text-right">
                    <button type="button" class="mr-4 font-medium text-primary-600 hover:text-primary-700" (click)="startEdit(category)">
                      Edit
                    </button>
                    <button type="button" class="font-medium text-red-500 hover:text-red-600" (click)="deleteCategory(category.categoryId)">
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
export class AdminCategoriesComponent implements OnInit {
  categories = signal<Category[]>([]);
  loading = signal(true);
  saving = signal(false);
  editingId = signal<number | null>(null);
  errorMessage = signal('');
  categoryName = '';

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.fetchCategories();
  }

  private fetchCategories(): void {
    this.loading.set(true);
    this.categoryService.getCategories({ pageSize: 100 }).subscribe({
      next: (res) => {
        this.categories.set(res.categoryDTOList);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  startEdit(category: Category): void {
    this.editingId.set(category.categoryId);
    this.categoryName = category.categoryName;
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.categoryName = '';
  }

  onSubmit(): void {
    if (!this.categoryName.trim()) return;

    this.saving.set(true);
    this.errorMessage.set('');

    const editingId = this.editingId();
    const request$ = editingId
      ? this.categoryService.updateCategory(editingId, this.categoryName)
      : this.categoryService.addCategory(this.categoryName);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.categoryName = '';
        this.editingId.set(null);
        this.fetchCategories();
      },
      error: () => {
        this.saving.set(false);
        this.errorMessage.set('Could not save category.');
      },
    });
  }

  deleteCategory(categoryId: number): void {
    this.categoryService.deleteCategory(categoryId).subscribe(() => this.fetchCategories());
  }
}
