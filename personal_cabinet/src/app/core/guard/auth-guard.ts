import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { CookieService } from '../../services/cookie.service';
import { AppFacadeService } from '../../services/app-facade.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const appFacadeService = inject(AppFacadeService);
  const cookieService = inject(CookieService);
  return true;
  // const authToken = cookieService.getCookieByName('authToken');
  // if (authToken) return true;
  // else {
  //   return authService.authRequest().pipe(
  //     map((isAuth) => {
  //       if (!isAuth) {
  //         appFacadeService.resetAppSettings();
  //         router.navigateByUrl('/login');
  //       }
  //       return isAuth;
  //     })
  //   );
  // }
};
