import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, ButtonComponent],
  template: `
    <div class="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <h1 class="mb-8 text-4xl">Create your account</h1>

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
          <label for="email" class="text-sm font-medium text-neutral-700">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            [(ngModel)]="email"
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
        @if (successMessage()) {
          <p class="text-sm text-emerald-600">{{ successMessage() }}</p>
        }

        <app-button type="submit" [disabled]="loading()" class="mt-2">
          {{ loading() ? 'Creating account...' : 'Create account' }}
        </app-button>
      </form>

      <p class="mt-6 text-sm text-neutral-600">
        Already have an account? <a routerLink="/login" class="font-semibold text-primary-600">Sign in</a>
      </p>
    </div>
  `,
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage.set('');
    this.successMessage.set('');
    this.loading.set(true);

    this.authService.signup({ username: this.username, email: this.email, password: this.password }).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMessage.set('Account created! Redirecting to sign in...');
        setTimeout(() => this.router.navigateByUrl('/login'), 1200);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message || 'Could not create account');
      },
    });
  }
}
