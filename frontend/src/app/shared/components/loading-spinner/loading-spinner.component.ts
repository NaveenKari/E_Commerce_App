import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    <div class="flex items-center justify-center py-16">
      <div class="h-10 w-10 animate-spin rounded-full border-4 border-neutral-200 border-t-primary-500"></div>
    </div>
  `,
})
export class LoadingSpinnerComponent {}
