import { Component, Input } from '@angular/core';

export type IconName = 'menu' | 'close' | 'heart' | 'heart-filled' | 'cart' | 'chat' | 'search';

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    @switch (name) {
      @case ('menu') {
        <svg [class]="svgClass" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      }
      @case ('close') {
        <svg [class]="svgClass" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="18" y1="6" x2="6" y2="18" />
        </svg>
      }
      @case ('heart') {
        <svg [class]="svgClass" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path
            d="M12 20.25c-.3 0-.6-.1-.8-.3C7.8 17 3 12.9 3 8.6 3 5.9 5.1 4 7.6 4c1.6 0 3.1.8 4 2.1.9-1.3 2.4-2.1 4-2.1C18.1 4 20.2 5.9 20.2 8.6c0 4.3-4.8 8.4-8.4 11.35-.2.2-.5.3-.8.3z"
          />
        </svg>
      }
      @case ('heart-filled') {
        <svg [class]="svgClass" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M12 20.25c-.3 0-.6-.1-.8-.3C7.8 17 3 12.9 3 8.6 3 5.9 5.1 4 7.6 4c1.6 0 3.1.8 4 2.1.9-1.3 2.4-2.1 4-2.1C18.1 4 20.2 5.9 20.2 8.6c0 4.3-4.8 8.4-8.4 11.35-.2.2-.5.3-.8.3z"
          />
        </svg>
      }
      @case ('cart') {
        <svg [class]="svgClass" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 3h2l.4 2M7 13h10l3-8H6.4M7 13L5.4 5M7 13l-1.8 4.5A1 1 0 006.1 19H17" />
          <circle cx="9" cy="21" r="1" />
          <circle cx="17" cy="21" r="1" />
        </svg>
      }
      @case ('chat') {
        <svg [class]="svgClass" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path
            d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
          />
        </svg>
      }
      @case ('search') {
        <svg [class]="svgClass" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      }
    }
  `,
})
export class IconComponent {
  @Input({ required: true }) name!: IconName;
  @Input() svgClass = 'h-5 w-5';
}
