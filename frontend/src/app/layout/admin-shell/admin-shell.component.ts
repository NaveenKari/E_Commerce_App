import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="flex min-h-screen">
      <aside class="w-56 shrink-0 border-r border-neutral-200 bg-white p-6">
        <a routerLink="/" class="font-display text-xl font-bold text-primary-600">Bazaar Admin</a>

        <nav class="mt-8 flex flex-col gap-1 text-sm font-medium text-neutral-700">
          <a
            routerLink="/admin"
            routerLinkActive="bg-primary-50 text-primary-600"
            [routerLinkActiveOptions]="{ exact: true }"
            class="rounded-lg px-3 py-2 hover:bg-neutral-100"
          >
            Dashboard
          </a>
          <a routerLink="/admin/categories" routerLinkActive="bg-primary-50 text-primary-600" class="rounded-lg px-3 py-2 hover:bg-neutral-100">
            Categories
          </a>
          <a routerLink="/admin/products" routerLinkActive="bg-primary-50 text-primary-600" class="rounded-lg px-3 py-2 hover:bg-neutral-100">
            Products
          </a>
          <a routerLink="/admin/orders" routerLinkActive="bg-primary-50 text-primary-600" class="rounded-lg px-3 py-2 hover:bg-neutral-100">
            Orders
          </a>
          <a routerLink="/" class="mt-6 rounded-lg px-3 py-2 text-neutral-500 hover:bg-neutral-100">&larr; Back to store</a>
        </nav>
      </aside>

      <main class="flex-1 bg-neutral-50">
        <router-outlet />
      </main>
    </div>
  `,
})
export class AdminShellComponent {}
