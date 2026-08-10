import { Component, OnInit, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

const ORDER_STATUSES = ['Order Accepted', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, LoadingSpinnerComponent, EmptyStateComponent],
  template: `
    <div class="p-8">
      <h1 class="mb-8 text-3xl">Orders</h1>

      @if (loading()) {
        <app-loading-spinner />
      } @else if (orders().length === 0) {
        <app-empty-state title="No orders yet" />
      } @else {
        <div class="card overflow-hidden">
          <table class="w-full text-left text-sm">
            <thead class="bg-neutral-50 text-neutral-500">
              <tr>
                <th class="px-4 py-3">Order</th>
                <th class="px-4 py-3">Customer</th>
                <th class="px-4 py-3">Date</th>
                <th class="px-4 py-3">Total</th>
                <th class="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              @for (order of orders(); track order.orderId) {
                <tr class="border-t border-neutral-100">
                  <td class="px-4 py-3">#{{ order.orderId }}</td>
                  <td class="px-4 py-3">{{ order.email }}</td>
                  <td class="px-4 py-3">{{ order.orderDate | date: 'mediumDate' }}</td>
                  <td class="px-4 py-3">{{ order.totalAmount | currency }}</td>
                  <td class="px-4 py-3">
                    <select
                      class="rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-medium focus:border-primary-500 focus:outline-none"
                      [value]="order.orderStatus"
                      [disabled]="updatingOrderId() === order.orderId"
                      (change)="onStatusChange(order, $any($event.target).value)"
                    >
                      @for (status of statuses; track status) {
                        <option [value]="status">{{ status }}</option>
                      }
                      @if (!statuses.includes(order.orderStatus)) {
                        <option [value]="order.orderStatus">{{ order.orderStatus }}</option>
                      }
                    </select>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
})
export class AdminOrdersComponent implements OnInit {
  orders = signal<Order[]>([]);
  loading = signal(true);
  updatingOrderId = signal<number | null>(null);
  statuses = ORDER_STATUSES;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onStatusChange(order: Order, status: string): void {
    this.updatingOrderId.set(order.orderId);
    this.orderService.updateOrderStatus(order.orderId, status).subscribe({
      next: (updated) => {
        this.orders.update((orders) => orders.map((o) => (o.orderId === updated.orderId ? updated : o)));
        this.updatingOrderId.set(null);
      },
      error: () => this.updatingOrderId.set(null),
    });
  }
}
