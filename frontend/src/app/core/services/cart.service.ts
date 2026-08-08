import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Cart } from '../models/cart.model';

const EMPTY_CART: Cart = { cartId: 0, totalPrice: 0, products: [] };

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly baseUrl = environment.apiBaseUrl;

  private readonly cartSignal = signal<Cart>(EMPTY_CART);
  readonly cart = this.cartSignal.asReadonly();
  readonly itemCount = computed(() => this.cartSignal().products.reduce((sum, p) => sum + p.quantity, 0));

  constructor(private http: HttpClient) {}

  loadCart(): Observable<Cart> {
    return this.http.get<Cart>(`${this.baseUrl}/carts/users/cart`).pipe(tap((cart) => this.cartSignal.set(cart)));
  }

  addToCart(productId: number, quantity: number): Observable<Cart> {
    return this.http
      .post<Cart>(`${this.baseUrl}/carts/products/${productId}/quantity/${quantity}`, {})
      .pipe(tap((cart) => this.cartSignal.set(cart)));
  }

  // Adding a product already in the cart is rejected by the backend (400); fall back to
  // incrementing its quantity instead so the caller doesn't need to know which case applies.
  addOrIncrement(productId: number, quantity = 1): Observable<Cart> {
    return this.addToCart(productId, quantity).pipe(
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse && error.status === 400) {
          return this.updateQuantity(productId, 'add');
        }
        return throwError(() => error);
      })
    );
  }

  updateQuantity(productId: number, operation: 'add' | 'delete'): Observable<Cart> {
    return this.http
      .put<Cart>(`${this.baseUrl}/cart/products/${productId}/quantity/${operation}`, {})
      .pipe(tap((cart) => this.cartSignal.set(cart)));
  }

  removeFromCart(productId: number): Observable<unknown> {
    const cartId = this.cartSignal().cartId;
    return this.http
      .delete(`${this.baseUrl}/carts/${cartId}/product/${productId}`, { responseType: 'text' })
      .pipe(
        tap(() => {
          this.cartSignal.update((cart) => ({
            ...cart,
            products: cart.products.filter((p) => p.productId !== productId),
          }));
        })
      );
  }

  clearLocalState(): void {
    this.cartSignal.set(EMPTY_CART);
  }
}
