import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <p class="font-display text-xl font-semibold text-neutral-700">{{ title }}</p>
      @if (subtitle) {
        <p class="text-neutral-500">{{ subtitle }}</p>
      }
    </div>
  `,
})
export class EmptyStateComponent {
  @Input() title = 'Nothing here yet';
  @Input() subtitle = '';
}
