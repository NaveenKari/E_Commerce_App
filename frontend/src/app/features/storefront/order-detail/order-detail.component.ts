import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { switchMap } from 'rxjs';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.model';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DatePipe, BadgeComponent, LoadingSpinnerComponent, EmptyStateComponent],
  template: `
    <div class="mx-auto max-w-2xl px-4 py-10">
      <a routerLink="/orders" class="text-sm font-medium text-neutral-500 hover:text-primary-600">&larr; Back to orders</a>

      @if (loading()) {
        <app-loading-spinner />
      } @else if (!order()) {
        <app-empty-state title="Order not found" subtitle="It may not belong to your account." />
      } @else {
        <div class="mt-6 flex items-center justify-between">
          <div>
            <h1 class="text-3xl">Order #{{ order()!.orderId }}</h1>
            <p class="text-sm text-neutral-500">Placed on {{ order()!.orderDate | date: 'mediumDate' }}</p>
          </div>
          <app-badge variant="success">{{ order()!.orderStatus }}</app-badge>
        </div>

        <div class="card mt-6 p-6">
          <h2 class="mb-4 font-display text-lg font-semibold">Items</h2>
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

        <div class="card mt-6 p-6">
          <h2 class="mb-2 font-display text-lg font-semibold">Payment</h2>
          <p class="text-sm text-neutral-700">{{ order()!.payment.paymentMethod }} &mdash; {{ order()!.payment.pgStatus }}</p>
        </div>
      }
    </div>
  `,
})
export class OrderDetailComponent implements OnInit {
  order = signal<Order | null>(null);
  loading = signal(true);

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(switchMap((params) => this.orderService.getOrderById(Number(params.get('id')))))
      .subscribe({
        next: (order) => {
          this.order.set(order);
          this.loading.set(false);
        },
        error: () => {
          this.order.set(null);
          this.loading.set(false);
        },
      });
  }
}
