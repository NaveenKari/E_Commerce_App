import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ChangePasswordRequest, LoginRequest, SignupRequest, UserInfo } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = `${environment.apiBaseUrl}/auth`;

  private readonly currentUserSignal = signal<UserInfo | null>(null);
  private readonly hydratedSignal = signal(false);

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly hydrated = this.hydratedSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);
  readonly roles = computed(() => this.currentUserSignal()?.roles ?? []);
  readonly isAdmin = computed(() => this.roles().includes('ROLE_ADMIN'));

  constructor(private http: HttpClient) {}

  hydrate(): Observable<UserInfo | null> {
    return new Observable<UserInfo | null>((subscriber) => {
      this.http.get<UserInfo>(`${this.baseUrl}/user`).subscribe({
        next: (user) => {
          this.currentUserSignal.set(user);
          this.hydratedSignal.set(true);
          subscriber.next(user);
          subscriber.complete();
        },
        error: () => {
          this.currentUserSignal.set(null);
          this.hydratedSignal.set(true);
          subscriber.next(null);
          subscriber.complete();
        },
      });
    });
  }

  signin(request: LoginRequest): Observable<UserInfo> {
    return this.http
      .post<UserInfo>(`${this.baseUrl}/signin`, request)
      .pipe(tap((user) => this.currentUserSignal.set(user)));
  }

  signup(request: SignupRequest): Observable<string> {
    return this.http.post(`${this.baseUrl}/signup`, request, { responseType: 'text' });
  }

  signout(): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/signout`, {}).pipe(tap(() => this.currentUserSignal.set(null)));
  }

  clearSession(): void {
    this.currentUserSignal.set(null);
  }

  changePassword(request: ChangePasswordRequest): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/change-password`, request);
  }
}
