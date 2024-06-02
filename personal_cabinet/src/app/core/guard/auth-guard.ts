import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { getIsAuth } from '../../../store/auth/auth.selector';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(getIsAuth).pipe(
    take(1),
    map((isAuth) => {
      if (!isAuth) {
        router.navigateByUrl('login');
        return false;
      } else return true;
    })
  );
};
