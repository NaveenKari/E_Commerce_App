import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly baseUrl = `${environment.apiBaseUrl}/wishlist`;

  private readonly itemsSignal = signal<Product[]>([]);
  readonly items = this.itemsSignal.asReadonly();
  readonly itemCount = computed(() => this.itemsSignal().length);

  constructor(private http: HttpClient) {}

  isSaved(productId: number): boolean {
    return this.itemsSignal().some((p) => p.productId === productId);
  }

  load(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl).pipe(tap((items) => this.itemsSignal.set(items)));
  }

  add(productId: number): Observable<Product[]> {
    return this.http
      .post<Product[]>(`${this.baseUrl}/products/${productId}`, {})
      .pipe(tap((items) => this.itemsSignal.set(items)));
  }

  remove(productId: number): Observable<Product[]> {
    return this.http
      .delete<Product[]>(`${this.baseUrl}/products/${productId}`)
      .pipe(tap((items) => this.itemsSignal.set(items)));
  }

  clearLocalState(): void {
    this.itemsSignal.set([]);
  }
}
