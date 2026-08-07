import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401 && req.url.includes('/auth/') === false) {
          authService.clearSession();
          router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
        } else if (error.status === 403) {
          router.navigate(['/not-authorized']);
        }
      }
      return throwError(() => error);
    })
  );
};
