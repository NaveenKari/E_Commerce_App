import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product, ProductInput, ProductResponse } from '../models/product.model';
import { PageParams } from '../models/pagination.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly baseUrl = `${environment.apiBaseUrl}`;

  constructor(private http: HttpClient) {}

  private toHttpParams(params: PageParams): HttpParams {
    let httpParams = new HttpParams();
    if (params.pageNumber !== undefined) httpParams = httpParams.set('pageNumber', params.pageNumber);
    if (params.pageSize !== undefined) httpParams = httpParams.set('pageSize', params.pageSize);
    if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
    if (params.sortOrder) httpParams = httpParams.set('sortOrder', params.sortOrder);
    return httpParams;
  }

  getProducts(params: PageParams = {}): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.baseUrl}/public/products`, { params: this.toHttpParams(params) });
  }

  getProductsByCategory(categoryId: number, params: PageParams = {}): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.baseUrl}/public/categories/${categoryId}/products`, {
      params: this.toHttpParams(params),
    });
  }

  searchProducts(keyword: string, params: PageParams = {}): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.baseUrl}/public/products/keyword/${encodeURIComponent(keyword)}`, {
      params: this.toHttpParams(params),
    });
  }

  getProductById(productId: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/public/products/${productId}`);
  }

  addProduct(categoryId: number, product: ProductInput): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/admin/categories/${categoryId}/product`, product);
  }

  updateProduct(productId: number, product: ProductInput): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/admin/product/${productId}`, product);
  }

  deleteProduct(productId: number): Observable<Product> {
    return this.http.delete<Product>(`${this.baseUrl}/admin/delete/product/${productId}`);
  }

  uploadImage(productId: number, file: File): Observable<Product> {
    const formData = new FormData();
    formData.append('Image', file);
    return this.http.put<Product>(`${this.baseUrl}/products/${productId}/image`, formData);
  }
}
