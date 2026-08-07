import { Component, Input } from '@angular/core';

export type BadgeVariant = 'sale' | 'new' | 'success' | 'danger' | 'neutral';

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  sale: 'bg-amber-100 text-amber-800',
  new: 'bg-accent-100 text-accent-700',
  success: 'bg-emerald-100 text-emerald-800',
  danger: 'bg-red-100 text-red-700',
  neutral: 'bg-neutral-100 text-neutral-700',
};

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `<span class="badge {{ variantClass }}"><ng-content /></span>`,
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'neutral';

  get variantClass(): string {
    return VARIANT_CLASSES[this.variant];
  }
}
