import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Order } from '../../../core/models/order.model';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DatePipe, ButtonComponent],
  template: `
    @if (order()) {
      <div class="mx-auto max-w-2xl px-4 py-16 text-center">
        <div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-600">
          &check;
        </div>
        <h1 class="text-4xl">Order confirmed!</h1>
        <p class="mt-2 text-neutral-600">Order #{{ order()!.orderId }} placed on {{ order()!.orderDate | date: 'mediumDate' }}</p>

        <div class="card mt-8 p-6 text-left">
          @for (item of order()!.orderItems; track item.orderItemId) {
            <div class="flex justify-between py-2 text-sm text-neutral-700">
              <span>{{ item.product.productName }} &times; {{ item.quantity }}</span>
              <span>{{ item.orderedProductPrice * item.quantity | currency }}</span>
            </div>
          }
          <div class="mt-4 flex justify-between border-t border-neutral-200 pt-4 font-display text-lg font-bold">
            <span>Total</span>
            <span>{{ order()!.totalAmount | currency }}</span>
          </div>
        </div>

        <div class="mt-8 flex justify-center gap-3">
          <a routerLink="/orders"><app-button variant="secondary">View orders</app-button></a>
          <a routerLink="/products"><app-button>Keep shopping</app-button></a>
        </div>
      </div>
    }
  `,
})
export class OrderConfirmationComponent implements OnInit {
  order = signal<Order | null>(null);

  constructor(private router: Router) {}

  ngOnInit(): void {
    const order = history.state?.order as Order | undefined;

    if (!order) {
      this.router.navigateByUrl('/orders');
      return;
    }

    this.order.set(order);
  }
}
