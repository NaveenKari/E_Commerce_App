import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, ButtonComponent],
  template: `
    <div class="mx-auto max-w-xl px-4 py-10">
      <h1 class="mb-8 text-4xl">Your account</h1>

      <section class="card mb-8 p-6">
        <h2 class="mb-4 font-display text-xl font-semibold">Profile</h2>
        <dl class="flex flex-col gap-3 text-sm">
          <div class="flex justify-between">
            <dt class="text-neutral-500">Username</dt>
            <dd class="font-medium text-neutral-900">{{ auth.currentUser()?.username }}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-neutral-500">Email</dt>
            <dd class="font-medium text-neutral-900">{{ auth.currentUser()?.email }}</dd>
          </div>
        </dl>
      </section>

      <section class="card p-6">
        <h2 class="mb-4 font-display text-xl font-semibold">Change password</h2>

        <form class="flex flex-col gap-4" (ngSubmit)="onSubmit()">
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-neutral-700">Current password</label>
            <input
              type="password"
              required
              name="currentPassword"
              [(ngModel)]="currentPassword"
              class="rounded-xl border border-neutral-300 px-4 py-2.5 focus:border-primary-500 focus:outline-none"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-neutral-700">New password</label>
            <input
              type="password"
              required
              minlength="6"
              name="newPassword"
              [(ngModel)]="newPassword"
              class="rounded-xl border border-neutral-300 px-4 py-2.5 focus:border-primary-500 focus:outline-none"
            />
          </div>

          @if (errorMessage()) {
            <p class="text-sm text-red-600">{{ errorMessage() }}</p>
          }
          @if (successMessage()) {
            <p class="text-sm text-emerald-600">{{ successMessage() }}</p>
          }

          <app-button type="submit" [disabled]="saving()" class="mt-2 w-fit">
            {{ saving() ? 'Updating...' : 'Update password' }}
          </app-button>
        </form>
      </section>
    </div>
  `,
})
export class ProfileComponent {
  currentPassword = '';
  newPassword = '';
  saving = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  constructor(public auth: AuthService) {}

  onSubmit(): void {
    this.saving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.auth.changePassword({ currentPassword: this.currentPassword, newPassword: this.newPassword }).subscribe({
      next: () => {
        this.saving.set(false);
        this.successMessage.set('Password updated successfully.');
        this.currentPassword = '';
        this.newPassword = '';
      },
      error: (err: HttpErrorResponse) => {
        this.saving.set(false);
        this.errorMessage.set(err.error?.message || 'Could not update password.');
      },
    });
  }
}
