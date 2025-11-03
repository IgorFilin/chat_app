import { HttpInterceptorFn } from '@angular/common/http';
import { retry } from 'rxjs';

export const retryRequestInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    retry({
      count: 2,
      delay: 400,
    })
  );
};
