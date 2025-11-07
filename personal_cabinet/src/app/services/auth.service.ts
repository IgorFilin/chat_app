import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { RequestService } from './request.service';
import { BehaviorSubject, Observable, catchError, finalize, firstValueFrom, map, of, shareReplay, tap } from 'rxjs';
import { UtilsService } from './utils.servise';
import { ToasterService } from './toaster.service';
import { LoadingService } from './loading.service';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IConfirm, ILoginBody, IRegistrationBody } from '../models/request';
import { CookieService } from './cookie.service';
import { GetAuthPesponseType, IUserInfo } from '../models/interfaces';
import { UserService } from './user.service';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { AuthRepository } from '../infrastructure/repositories/auth.repository';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuth$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  readonly isAuth = signal(false);
  isInitialApp: boolean = false;
  destroyRef = inject(DestroyRef);
  authRepository = inject(AuthRepository);
  refreshToken$: Observable<any> | null = null;

  private _accessToken: string | null = null;

  get accessToken() {
    return this._accessToken;
  }

  set accessTokenUpdate(token: string) {
    this._accessToken = token;
  }

  getDecodeToken(): JwtPayload | null {
    if (this.accessToken) {
      const decodedToken = jwtDecode(this.accessToken);
      return decodedToken;
    }
    return null;
  }

  isValidToken() {
    const decodedToken = this.getDecodeToken();

    if (!decodedToken) return false;

    return decodedToken.exp! >= new Date().getTime();
  }

  refresh(): any {
    if (this.refreshToken$) {
      return this.refreshToken$;
    }

    this.refreshToken$ = this.authRepository.refreshToken().pipe(
      tap(({ data }) => {
        const { accessToken } = data as any;
        this.accessTokenUpdate = accessToken;
      }),
      finalize(() => {
        this.refreshToken$ = null;
      }),
      shareReplay({
        bufferSize: 1,
        refCount: true,
      })
    );

    return this.refreshToken$;
  }

  constructor(
    private requestService: RequestService,
    private utilsService: UtilsService,
    private toastService: ToasterService,
    private loadingService: LoadingService,
    private cookieService: CookieService,
    private userService: UserService,
    private router: Router
  ) {}

  private setAuthData(data: IUserInfo): void {
    this.userService.userInfo.next(data);
  }

  authRequest(): Observable<any> {
    this.loadingService.startLoading();
    return this.requestService.get<any, GetAuthPesponseType>('user/auth').pipe(
      takeUntilDestroyed(this.destroyRef),
      map((data: GetAuthPesponseType) => {
        if (data.isAuth && !this.isInitialApp) {
          this.toastService.success(`Приветствую ${data.name}`);
          this.isAuth$.next(data.isAuth);
          this.isInitialApp = true;
        }
        this.setAuthData(data);
        this.loadingService.stopLoading();
        return data.isAuth;
      }),
      catchError((error) => {
        this.isAuth$.next(false);
        this.loadingService.stopLoading();
        this.isInitialApp = true;
        return of(false);
      })
    );
  }

  login(body: ILoginBody): void {
    this.loadingService.startLoading();
    this.requestService
      .post<ILoginBody, any>('user/login', body)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        (data) => {
          this.setAuthAndNavigateMainPage(data);
          //@ts-ignore
          if (window._tmr) {
            console.log('отправка....');
            //@ts-ignore
            window._tmr.push({
              id: '3679925',
              type: 'reachGoal',
              goal: 'register',
            });
          }
        },
        (error) => {
          const errorMessage = error.error.message || 'К сожалению произошла ошибка';
          this.toastService.error(errorMessage);
        }
      );
  }

  registration(body: IRegistrationBody): void {
    this.loadingService.startLoading();
    this.requestService
      .post<IRegistrationBody, any>('gateway/registration', body)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error) => {
          const errorMessage = error.error.message;
          this.loadingService.stopLoading();
          this.toastService.error(errorMessage);
          return error;
        })
      )
      .subscribe((data) => {
        this.toastService.success('Пожалуйста подтвердите вашу почту');
        this.router.navigateByUrl('confirm');
      });
  }

  confirm(body: IConfirm): void {
    this.loadingService.startLoading();
    this.requestService
      .get<IConfirm, any>('user/confirm', body)
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
        this.isAuth$.next(true);
        this.router.navigateByUrl('/');
      });
  }

  exit(): void {
    this.loadingService.startLoading();
    this.requestService
      .get('user/logout')
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error) => {
          // const errorMessage = error.error.message;
          this.loadingService.stopLoading();
          // this.toastService.error('errorMessage');
          return error;
        })
      )
      .subscribe((data: any) => {
        this.toastService.success('Вы успешно вышли, возращайтесь!');
        this.isAuth$.next(data.isAuth);
        this.router.navigateByUrl('registration');
      });
  }

  async setAuthAndNavigateMainPage(data: any) {
    this.accessTokenUpdate = data.accessToken;
    this.isAuth$.next(data.isAuth);
    this.isAuth.set(true);
    this.router.navigateByUrl('/');
  }
}
