import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = () => checkAdminAccess();
export const authMatchGuard: CanMatchFn = () => checkAdminAccess();

function checkAdminAccess() {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (typeof window === 'undefined' || !window.localStorage) {
    return router.createUrlTree(['/']);
  }

  const token = window.localStorage.getItem('auth_token');
  const normalizedToken = typeof token === 'string' ? token.trim() : '';
  const hasValidToken =
    normalizedToken.length > 0 &&
    normalizedToken !== 'undefined' &&
    normalizedToken !== 'null';

  if (!hasValidToken) {
    authService.clearSession();
    return router.createUrlTree(['/']);
  }

  return authService.validateSession().pipe(
    map((user: any) => {
      if (user?.role === 'admin') {
        return true;
      }

      return router.createUrlTree(['/']);
    }),
    catchError(() => {
      authService.clearSession();
      return of(router.createUrlTree(['/']));
    })
  );
}
