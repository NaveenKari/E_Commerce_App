import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-not-authorized',
  standalone: true,
  imports: [RouterLink, ButtonComponent],
  template: `
    <div class="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 class="text-4xl">Not authorized</h1>
      <p class="text-neutral-600">You don't have permission to view this page.</p>
      <a routerLink="/"><app-button variant="secondary">Back to home</app-button></a>
    </div>
  `,
})
export class NotAuthorizedComponent {}
