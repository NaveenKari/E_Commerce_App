import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CategoryResponse } from '../models/category.model';
import { PageParams } from '../models/pagination.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly baseUrl = `${environment.apiBaseUrl}/public/categories`;

  constructor(private http: HttpClient) {}

  getCategories(params: PageParams = {}): Observable<CategoryResponse> {
    let httpParams = new HttpParams();
    if (params.pageNumber !== undefined) httpParams = httpParams.set('pageNumber', params.pageNumber);
    if (params.pageSize !== undefined) httpParams = httpParams.set('pageSize', params.pageSize);
    if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
    if (params.sortOrder) httpParams = httpParams.set('sortOrder', params.sortOrder);

    return this.http.get<CategoryResponse>(this.baseUrl, { params: httpParams });
  }
}
