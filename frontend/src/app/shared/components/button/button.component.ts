import { Component, Input } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button
      [type]="type"
      [disabled]="disabled"
      [class]="buttonClasses"
      [class.opacity-50]="disabled"
      [class.pointer-events-none]="disabled"
    >
      <ng-content />
    </button>
  `,
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled = false;
  @Input() customClass = '';

  get buttonClasses(): string {
    const base = this.variant === 'primary' ? 'btn-primary' : 'btn-secondary';
    return this.customClass ? `${base} ${this.customClass}` : base;
  }
}
