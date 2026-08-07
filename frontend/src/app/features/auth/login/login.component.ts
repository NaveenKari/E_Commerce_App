import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, ButtonComponent],
  template: `
    <div class="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <h1 class="mb-8 text-4xl">Welcome back</h1>

      <form class="flex flex-col gap-4" (ngSubmit)="onSubmit()">
        <div class="flex flex-col gap-1">
          <label for="username" class="text-sm font-medium text-neutral-700">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            required
            [(ngModel)]="username"
            class="rounded-xl border border-neutral-300 px-4 py-2.5 focus:border-primary-500 focus:outline-none"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label for="password" class="text-sm font-medium text-neutral-700">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            [(ngModel)]="password"
            class="rounded-xl border border-neutral-300 px-4 py-2.5 focus:border-primary-500 focus:outline-none"
          />
        </div>

        @if (errorMessage()) {
          <p class="text-sm text-red-600">{{ errorMessage() }}</p>
        }

        <app-button type="submit" [disabled]="loading()" class="mt-2">
          {{ loading() ? 'Signing in...' : 'Sign in' }}
        </app-button>
      </form>

      <p class="mt-6 text-sm text-neutral-600">
        Don't have an account? <a routerLink="/register" class="font-semibold text-primary-600">Create one</a>
      </p>
    </div>
  `,
})
export class LoginComponent {
  username = '';
  password = '';
  loading = signal(false);
  errorMessage = signal('');

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  onSubmit(): void {
    this.errorMessage.set('');
    this.loading.set(true);

    this.authService.signin({ username: this.username, password: this.password }).subscribe({
      next: () => {
        this.loading.set(false);
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message?.trim() || 'Invalid username or password');
      },
    });
  }
}
