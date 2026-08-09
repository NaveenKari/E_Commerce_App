import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AddressService } from '../../../core/services/address.service';
import { Address, AddressInput } from '../../../core/models/address.model';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

const EMPTY_FORM: AddressInput = {
  street: '',
  buildingName: '',
  city: '',
  state: '',
  country: '',
  pincode: '',
};

@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [FormsModule, ButtonComponent, LoadingSpinnerComponent, EmptyStateComponent],
  template: `
    <div class="mx-auto max-w-2xl px-4 py-10">
      <div class="mb-8 flex items-center justify-between">
        <h1 class="text-4xl">Your addresses</h1>
        @if (!showForm()) {
          <app-button (click)="startCreate()">Add address</app-button>
        }
      </div>

      @if (showForm()) {
        <form class="card mb-8 flex flex-col gap-4 p-6" (ngSubmit)="onSubmit()">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-neutral-700">Street</label>
              <input
                required
                name="street"
                [(ngModel)]="form.street"
                class="rounded-xl border border-neutral-300 px-4 py-2.5 focus:border-primary-500 focus:outline-none"
              />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-neutral-700">Building name</label>
              <input
                required
                name="buildingName"
                [(ngModel)]="form.buildingName"
                class="rounded-xl border border-neutral-300 px-4 py-2.5 focus:border-primary-500 focus:outline-none"
              />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-neutral-700">City</label>
              <input
                required
                name="city"
                [(ngModel)]="form.city"
                class="rounded-xl border border-neutral-300 px-4 py-2.5 focus:border-primary-500 focus:outline-none"
              />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-neutral-700">State</label>
              <input
                required
                name="state"
                [(ngModel)]="form.state"
                class="rounded-xl border border-neutral-300 px-4 py-2.5 focus:border-primary-500 focus:outline-none"
              />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-neutral-700">Country</label>
              <input
                required
                name="country"
                [(ngModel)]="form.country"
                class="rounded-xl border border-neutral-300 px-4 py-2.5 focus:border-primary-500 focus:outline-none"
              />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-neutral-700">Pincode</label>
              <input
                required
                name="pincode"
                [(ngModel)]="form.pincode"
                class="rounded-xl border border-neutral-300 px-4 py-2.5 focus:border-primary-500 focus:outline-none"
              />
            </div>
          </div>

          @if (errorMessage()) {
            <p class="text-sm text-red-600">{{ errorMessage() }}</p>
          }

          <div class="flex gap-3">
            <app-button type="submit" [disabled]="saving()">{{ editingId() ? 'Save changes' : 'Add address' }}</app-button>
            <app-button variant="secondary" (click)="cancelForm()">Cancel</app-button>
          </div>
        </form>
      }

      @if (loading()) {
        <app-loading-spinner />
      } @else if (addresses().length === 0 && !showForm()) {
        <app-empty-state title="No addresses yet" subtitle="Add one to speed up checkout." />
      } @else {
        <div class="flex flex-col gap-4">
          @for (address of addresses(); track address.addressId) {
            <div class="card flex items-start justify-between gap-4 p-4">
              <div class="text-sm text-neutral-700">
                <p class="font-display font-semibold text-neutral-900">{{ address.buildingName }}, {{ address.street }}</p>
                <p>{{ address.city }}, {{ address.state }} {{ address.pincode }}</p>
                <p>{{ address.country }}</p>
              </div>
              <div class="flex shrink-0 gap-3 text-sm font-medium">
                <button type="button" class="text-primary-600 hover:text-primary-700" (click)="startEdit(address)">Edit</button>
                <button type="button" class="text-red-500 hover:text-red-600" (click)="deleteAddress(address.addressId)">Delete</button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class AddressesComponent implements OnInit {
  addresses = signal<Address[]>([]);
  loading = signal(true);
  saving = signal(false);
  showForm = signal(false);
  editingId = signal<number | null>(null);
  errorMessage = signal('');
  form: AddressInput = { ...EMPTY_FORM };

  constructor(private addressService: AddressService) {}

  ngOnInit(): void {
    this.fetchAddresses();
  }

  private fetchAddresses(): void {
    this.loading.set(true);
    this.addressService.getMyAddresses().subscribe({
      next: (addresses) => {
        this.addresses.set(addresses);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  startCreate(): void {
    this.editingId.set(null);
    this.form = { ...EMPTY_FORM };
    this.errorMessage.set('');
    this.showForm.set(true);
  }

  startEdit(address: Address): void {
    this.editingId.set(address.addressId);
    const { addressId, ...rest } = address;
    this.form = { ...rest };
    this.errorMessage.set('');
    this.showForm.set(true);
  }

  cancelForm(): void {
    this.showForm.set(false);
  }

  onSubmit(): void {
    this.saving.set(true);
    this.errorMessage.set('');

    const editingId = this.editingId();
    const request$ = editingId
      ? this.addressService.updateAddress(editingId, this.form)
      : this.addressService.createAddress(this.form);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.showForm.set(false);
        this.fetchAddresses();
      },
      error: () => {
        this.saving.set(false);
        this.errorMessage.set('Could not save address. Check the fields and try again.');
      },
    });
  }

  deleteAddress(addressId: number): void {
    this.addressService.deleteAddress(addressId).subscribe(() => this.fetchAddresses());
  }
}
