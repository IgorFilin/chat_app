import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { inject } from '@angular/core';

export const mountAccessTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const accessToken = authService.accessToken;

  if (!accessToken) return next(req);

  let headers = new HttpHeaders();
  headers = headers.append('Authorization', `Bearer ${accessToken}`);

  const updateReq = req.clone({
    headers,
  });

  return next(updateReq);
};
