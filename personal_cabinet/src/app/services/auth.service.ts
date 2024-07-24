import { DestroyRef, Injectable, inject } from '@angular/core';
import { RequestService } from './request.service';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { UtilsService } from './utils.servise';
import { ToasterService } from './toaster.service';
import { LoadingService } from './loading.service';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
export interface AuthType {
  isAuth: boolean;
  isLoading: boolean;
}

interface GetAuthPesponseType {
  isAuth: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuth$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  destroyRef = inject(DestroyRef);

  constructor(
    private requestService: RequestService,
    private utilsService: UtilsService,
    private toastService: ToasterService,
    private loadingService: LoadingService,
    private router: Router
  ) {}

  authRequest(): Observable<any> {
    this.loadingService.startLoading();
    return this.requestService.get('user/auth').pipe(
      takeUntilDestroyed(this.destroyRef),
      map((data: GetAuthPesponseType) => {
        this.toastService.success('Вы успешно авторизованы');
        this.isAuth$.next(data.isAuth);
        this.router.navigateByUrl('/');
        this.loadingService.stopLoading();
      }),
      catchError((error) => {
        // const errorMessage = error.error.message;
        this.loadingService.stopLoading();
        // this.toastService.error('errorMessage');
        return of(error);
      })
    );
  }

  login(body: Record<string, string>): void {
    this.loadingService.startLoading();
    this.requestService
      .post('user/login', body)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error) => {
          // const errorMessage = error.error.message;
          this.loadingService.stopLoading();
          // this.toastService.error('errorMessage');
          return error;
        })
      )
      .subscribe((data) => {
        this.toastService.success(data.message);
        console.log(data);
        this.isAuth$.next(data.isAuth);
        this.router.navigateByUrl('/');
      });
  }
}
