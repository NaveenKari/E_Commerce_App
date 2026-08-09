import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.model';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DatePipe, BadgeComponent, ButtonComponent, LoadingSpinnerComponent, EmptyStateComponent],
  template: `
    <div class="mx-auto max-w-3xl px-4 py-10">
      <h1 class="mb-8 text-4xl">Your orders</h1>

      @if (loading()) {
        <app-loading-spinner />
      } @else if (orders().length === 0) {
        <app-empty-state title="No orders yet" subtitle="Your placed orders will show up here." />
        <div class="flex justify-center">
          <a routerLink="/products"><app-button>Start shopping</app-button></a>
        </div>
      } @else {
        <div class="flex flex-col gap-4">
          @for (order of orders(); track order.orderId) {
            <div class="card p-6">
              <div class="mb-4 flex items-center justify-between">
                <div>
                  <p class="font-display font-semibold text-neutral-900">Order #{{ order.orderId }}</p>
                  <p class="text-sm text-neutral-500">{{ order.orderDate | date: 'mediumDate' }}</p>
                </div>
                <app-badge variant="success">{{ order.orderStatus }}</app-badge>
              </div>

              <div class="flex flex-col gap-1">
                @for (item of order.orderItems; track item.orderItemId) {
                  <div class="flex justify-between text-sm text-neutral-700">
                    <span>{{ item.product.productName }} &times; {{ item.quantity }}</span>
                    <span>{{ item.orderedProductPrice * item.quantity | currency }}</span>
                  </div>
                }
              </div>

              <div class="mt-4 flex justify-between border-t border-neutral-200 pt-4 font-display font-bold">
                <span>Total</span>
                <span>{{ order.totalAmount | currency }}</span>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class OrderHistoryComponent implements OnInit {
  orders = signal<Order[]>([]);
  loading = signal(true);

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getMyOrders().subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
