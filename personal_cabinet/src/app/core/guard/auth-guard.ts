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
 
  return authService.authRequest().pipe(
    map((isAuth) => {
      console.log('-__', isAuth);
      if(!isAuth) {
        appFacadeService.resetAppSettings()
        router.navigateByUrl('/login')
      }
      return isAuth
    })
)};
