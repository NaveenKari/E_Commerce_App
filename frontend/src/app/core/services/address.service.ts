import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Address, AddressInput } from '../models/address.model';

@Injectable({ providedIn: 'root' })
export class AddressService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getMyAddresses(): Observable<Address[]> {
    return this.http.get<Address[]>(`${this.baseUrl}/users/addresses`);
  }

  createAddress(address: AddressInput): Observable<Address> {
    return this.http.post<Address>(`${this.baseUrl}/addresses`, address);
  }

  updateAddress(addressId: number, address: AddressInput): Observable<Address> {
    return this.http.put<Address>(`${this.baseUrl}/addresses/${addressId}`, address);
  }

  deleteAddress(addressId: number): Observable<unknown> {
    return this.http.delete(`${this.baseUrl}/addresses/${addressId}`, { responseType: 'text' });
  }
}
