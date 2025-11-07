import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { switchMap } from 'rxjs';

const IS_IGNORE_REQUESTS = ['refresh', 'login', 'registration'];

export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const isInvalidReqExist = IS_IGNORE_REQUESTS.some((ignoredReq) => req.url.includes(ignoredReq));

  if (isInvalidReqExist) {
    return next(req);
  }

  const isValid = authService.isValidToken();

  if (!isValid) {
    return authService.refresh().pipe(
      switchMap(() => {
        return next(req);
      })
    );
  }
  return next(req);
};
