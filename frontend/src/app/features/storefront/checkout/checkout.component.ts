import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { AddressService } from '../../../core/services/address.service';
import { OrderService } from '../../../core/services/order.service';
import { CartService } from '../../../core/services/cart.service';
import { Address } from '../../../core/models/address.model';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

const PAYMENT_METHODS = ['Card', 'UPI', 'Cash on Delivery'];

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule, RouterLink, CurrencyPipe, ButtonComponent, LoadingSpinnerComponent, EmptyStateComponent],
  template: `
    <div class="mx-auto max-w-2xl px-4 py-10">
      <h1 class="mb-8 text-4xl">Checkout</h1>

      @if (loading()) {
        <app-loading-spinner />
      } @else if (cart().products.length === 0) {
        <app-empty-state title="Your cart is empty" subtitle="Add something before checking out." />
      } @else if (addresses().length === 0) {
        <app-empty-state title="No delivery address" subtitle="Add an address before placing an order." />
        <div class="flex justify-center">
          <a routerLink="/account/addresses"><app-button>Add an address</app-button></a>
        </div>
      } @else {
        <section class="card mb-6 p-6">
          <h2 class="mb-4 font-display text-xl font-semibold">Delivery address</h2>
          <div class="flex flex-col gap-3">
            @for (address of addresses(); track address.addressId) {
              <label class="flex cursor-pointer items-start gap-3 rounded-xl border p-3" [class.border-primary-500]="selectedAddressId() === address.addressId" [class.border-neutral-200]="selectedAddressId() !== address.addressId">
                <input
                  type="radio"
                  name="address"
                  class="mt-1"
                  [checked]="selectedAddressId() === address.addressId"
                  (change)="selectedAddressId.set(address.addressId)"
                />
                <span class="text-sm text-neutral-700">
                  <span class="block font-semibold text-neutral-900">{{ address.buildingName }}, {{ address.street }}</span>
                  {{ address.city }}, {{ address.state }} {{ address.pincode }}, {{ address.country }}
                </span>
              </label>
            }
          </div>
        </section>

        <section class="card mb-6 p-6">
          <h2 class="mb-4 font-display text-xl font-semibold">Payment method</h2>
          <div class="flex flex-wrap gap-3">
            @for (method of paymentMethods; track method) {
              <button
                type="button"
                class="rounded-full border px-4 py-2 text-sm font-medium"
                [class.border-primary-500]="selectedPaymentMethod() === method"
                [class.bg-primary-50]="selectedPaymentMethod() === method"
                [class.border-neutral-300]="selectedPaymentMethod() !== method"
                (click)="selectedPaymentMethod.set(method)"
              >
                {{ method }}
              </button>
            }
          </div>
        </section>

        <section class="card mb-6 p-6">
          <h2 class="mb-4 font-display text-xl font-semibold">Order summary</h2>
          <div class="flex flex-col gap-2">
            @for (item of cart().products; track item.productId) {
              <div class="flex justify-between text-sm text-neutral-700">
                <span>{{ item.productName }} &times; {{ item.quantity }}</span>
                <span>{{ item.specialPrice * item.quantity | currency }}</span>
              </div>
            }
          </div>
          <div class="mt-4 flex justify-between border-t border-neutral-200 pt-4 font-display text-lg font-bold">
            <span>Total</span>
            <span>{{ cart().totalPrice | currency }}</span>
          </div>
        </section>

        @if (errorMessage()) {
          <p class="mb-4 text-sm text-red-600">{{ errorMessage() }}</p>
        }

        <app-button [disabled]="placing() || !selectedAddressId()" (click)="placeOrder()">
          {{ placing() ? 'Placing order...' : 'Place order' }}
        </app-button>
      }
    </div>
  `,
})
export class CheckoutComponent implements OnInit {
  loading = signal(true);
  placing = signal(false);
  addresses = signal<Address[]>([]);
  selectedAddressId = signal<number | null>(null);
  paymentMethods = PAYMENT_METHODS;
  selectedPaymentMethod = signal(PAYMENT_METHODS[0]);
  errorMessage = signal('');

  cart;

  constructor(
    private addressService: AddressService,
    private orderService: OrderService,
    private cartService: CartService,
    private router: Router
  ) {
    this.cart = this.cartService.cart;
  }

  ngOnInit(): void {
    this.addressService.getMyAddresses().subscribe({
      next: (addresses) => {
        this.addresses.set(addresses);
        if (addresses.length > 0) {
          this.selectedAddressId.set(addresses[0].addressId);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  placeOrder(): void {
    const addressId = this.selectedAddressId();
    if (!addressId) return;

    this.placing.set(true);
    this.errorMessage.set('');

    const paymentMethod = this.selectedPaymentMethod();
    this.orderService
      .placeOrder(paymentMethod, {
        addressId,
        paymentMethod,
        pgName: 'Simulated Gateway',
        pgPaymentId: `SIM-${Date.now()}`,
        pgStatus: 'success',
        pgResponseMessage: 'Payment approved',
      })
      .subscribe({
        next: (order) => {
          this.placing.set(false);
          this.cartService.loadCart().subscribe();
          this.router.navigate(['/checkout/confirmation'], { state: { order } });
        },
        error: () => {
          this.placing.set(false);
          this.errorMessage.set('Could not place order. Please try again.');
        },
      });
  }
}
