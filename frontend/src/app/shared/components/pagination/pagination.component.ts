import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  template: `
    @if (totalPages > 1) {
      <div class="flex items-center justify-center gap-2 py-10">
        <button
          type="button"
          class="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium disabled:opacity-40"
          [disabled]="pageNumber === 0"
          (click)="pageChange.emit(pageNumber - 1)"
        >
          Prev
        </button>

        <span class="text-sm text-neutral-600">Page {{ pageNumber + 1 }} of {{ totalPages }}</span>

        <button
          type="button"
          class="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium disabled:opacity-40"
          [disabled]="pageNumber >= totalPages - 1"
          (click)="pageChange.emit(pageNumber + 1)"
        >
          Next
        </button>
      </div>
    }
  `,
})
export class PaginationComponent {
  @Input({ required: true }) pageNumber = 0;
  @Input({ required: true }) totalPages = 0;
  @Output() pageChange = new EventEmitter<number>();
}
