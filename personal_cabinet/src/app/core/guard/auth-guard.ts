import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { getIsAuth } from '../../../store/auth/auth.selector';
import { map, take } from 'rxjs';
import { AuthService } from '../../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuth$.pipe(
    take(1),
    map((isAuth) => {
      if (!isAuth) {
        router.navigateByUrl('login');
        return false;
      } else return true;
    })
  );
};
