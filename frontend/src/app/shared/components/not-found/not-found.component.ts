import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, ButtonComponent],
  template: `
    <div class="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <p class="font-display text-6xl font-bold text-primary-500">404</p>
      <h1 class="text-3xl">Page not found</h1>
      <p class="text-neutral-600">The page you're looking for doesn't exist or has moved.</p>
      <a routerLink="/"><app-button>Back to home</app-button></a>
    </div>
  `,
})
export class NotFoundComponent {}
