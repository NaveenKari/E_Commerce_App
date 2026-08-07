import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div class="mx-auto max-w-6xl px-4 py-16 text-center">
      <h1 class="text-6xl">Bold looks. Better prices.</h1>
      <p class="mt-4 text-lg text-neutral-600">Product browsing coming next.</p>
    </div>
  `,
})
export class HomeComponent {}
