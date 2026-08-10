import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, IconComponent],
  template: `
    <div class="flex min-h-screen flex-col lg:flex-row">
      <!-- Mobile/tablet top bar -->
      <div
        class="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3 lg:hidden"
      >
        <a routerLink="/" class="font-display text-lg font-bold text-primary-600">Bazaar Admin</a>
        <button
          type="button"
          class="text-neutral-700 hover:text-primary-600"
          (click)="sidebarOpen.set(!sidebarOpen())"
          [attr.aria-expanded]="sidebarOpen()"
          aria-label="Toggle admin menu"
        >
          <app-icon [name]="sidebarOpen() ? 'close' : 'menu'" svgClass="h-6 w-6" />
        </button>
      </div>

      @if (sidebarOpen()) {
        <div class="fixed inset-0 z-30 bg-black/30 lg:hidden" (click)="sidebarOpen.set(false)"></div>
      }

      <aside
        class="fixed inset-y-0 left-0 z-40 w-64 -translate-x-full overflow-y-auto border-r border-neutral-200 bg-white p-6 transition-transform duration-150 lg:static lg:z-auto lg:w-56 lg:shrink-0 lg:translate-x-0"
        [class.translate-x-0]="sidebarOpen()"
      >
        <a routerLink="/" class="hidden font-display text-xl font-bold text-primary-600 lg:block">Bazaar Admin</a>

        <nav class="mt-2 flex flex-col gap-1 text-sm font-medium text-neutral-700 lg:mt-8">
          <a
            routerLink="/admin"
            routerLinkActive="bg-primary-50 text-primary-600"
            [routerLinkActiveOptions]="{ exact: true }"
            class="rounded-lg px-3 py-2 hover:bg-neutral-100"
            (click)="sidebarOpen.set(false)"
          >
            Dashboard
          </a>
          <a
            routerLink="/admin/categories"
            routerLinkActive="bg-primary-50 text-primary-600"
            class="rounded-lg px-3 py-2 hover:bg-neutral-100"
            (click)="sidebarOpen.set(false)"
          >
            Categories
          </a>
          <a
            routerLink="/admin/products"
            routerLinkActive="bg-primary-50 text-primary-600"
            class="rounded-lg px-3 py-2 hover:bg-neutral-100"
            (click)="sidebarOpen.set(false)"
          >
            Products
          </a>
          <a
            routerLink="/admin/orders"
            routerLinkActive="bg-primary-50 text-primary-600"
            class="rounded-lg px-3 py-2 hover:bg-neutral-100"
            (click)="sidebarOpen.set(false)"
          >
            Orders
          </a>
          <a
            routerLink="/"
            class="mt-6 rounded-lg px-3 py-2 text-neutral-500 hover:bg-neutral-100"
            (click)="sidebarOpen.set(false)"
          >
            &larr; Back to store
          </a>
        </nav>
      </aside>

      <main class="flex-1 bg-neutral-50">
        <router-outlet />
      </main>
    </div>
  `,
})
export class AdminShellComponent {
  readonly sidebarOpen = signal(false);
}
