import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';
import { ProductService } from '../../../core/services/product.service';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="p-8">
      <h1 class="mb-8 text-3xl">Dashboard</h1>

      <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <a routerLink="/admin/categories" class="card p-6">
          <p class="text-sm text-neutral-500">Categories</p>
          <p class="font-display text-4xl font-bold text-neutral-900">{{ categoryCount() }}</p>
        </a>
        <a routerLink="/admin/products" class="card p-6">
          <p class="text-sm text-neutral-500">Products</p>
          <p class="font-display text-4xl font-bold text-neutral-900">{{ productCount() }}</p>
        </a>
        <a routerLink="/admin/orders" class="card p-6">
          <p class="text-sm text-neutral-500">Orders</p>
          <p class="font-display text-4xl font-bold text-neutral-900">{{ orderCount() }}</p>
        </a>
      </div>
    </div>
  `,
})
export class AdminDashboardComponent implements OnInit {
  categoryCount = signal<number | null>(null);
  productCount = signal<number | null>(null);
  orderCount = signal<number | null>(null);

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.categoryService.getCategories({ pageSize: 1 }).subscribe((res) => this.categoryCount.set(res.totalElements));
    this.productService.getProducts({ pageSize: 1 }).subscribe((res) => this.productCount.set(res.totalElements));
    this.orderService.getAllOrders().subscribe((orders) => this.orderCount.set(orders.length));
  }
}
