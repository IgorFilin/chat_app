import { Injectable } from '@angular/core';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Store } from '@ngrx/store';
import {
  authAction,
  completedExit,
  completedLogin,
  completedRegistrationAction,
  exitAction,
  registrationConfirm,
  registrationFailure,
  startLoading,
  startLogin,
  startRegistrationAction,
  stopLoading,
} from './auth.actions';
import { ResponseDataRegistrationType } from './types';
import { Router } from '@angular/router';
import { UtilsService } from '../../app/services/utils.servise';
import { ToasterService } from '../../app/services/toaster.service';

@Injectable()
export class AuthEffect {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store,
    private router: Router,
    private utils: UtilsService,
    private toast: ToasterService
  ) {}

  registration = createEffect(() =>
    this.actions$.pipe(
      ofType(startRegistrationAction),
      tap(() => this.store.dispatch(startLoading())),
      exhaustMap((actionData) => {
        return this.http
          .post(`${environment.apiBaseUrl}/user/registration`, {
            name: actionData.name,
            password: actionData.password,
            email: actionData.email,
          })
          .pipe(
            map((data) => {
              this.store.dispatch(stopLoading());
              this.toast.success('Пожалуйста подтвердите вашу почту');
              this.router.navigateByUrl('confirm');
              return completedRegistrationAction(
                data as ResponseDataRegistrationType
              );
            }),
            catchError((error) => {
              const errorMessage = error.error.message;
              this.toast.error(errorMessage);
              this.store.dispatch(stopLoading());
              return of(registrationFailure({ error }));
            })
          );
      })
    )
  );

  confirmRegistration = createEffect(() =>
    this.actions$.pipe(
      ofType(registrationConfirm),
      tap(() => this.store.dispatch(startLoading())),
      exhaustMap((actionData) => {
        const params = new HttpParams().set('key', actionData.key);
        return this.http
          .get(`${environment.apiBaseUrl}/user/confirm`, {
            params,
            withCredentials: true,
          })
          .pipe(
            map((data) => {
              this.store.dispatch(stopLoading());
              this.toast.success('Добро пожаловать');
              this.router.navigateByUrl('/');
              return completedRegistrationAction(
                data as ResponseDataRegistrationType
              );
            }),
            catchError((error) => {
              const errorMessage = error.error.message;
              this.toast.error(errorMessage);
              this.store.dispatch(stopLoading());
              return of(registrationFailure({ error }));
            })
          );
      })
    )
  );

  auth = createEffect(() =>
    this.actions$.pipe(
      ofType(authAction),
      tap(() => this.store.dispatch(startLoading())),
      exhaustMap(() => {
        return this.http
          .get(`${environment.apiBaseUrl}/user/auth`, {
            withCredentials: true,
          })
          .pipe(
            map((data) => {
              this.store.dispatch(stopLoading());
              this.toast.success('Вы успешно авторизованы');
              this.router.navigateByUrl('/');
              return completedRegistrationAction(
                data as ResponseDataRegistrationType
              );
            }),
            catchError((error) => {
              this.store.dispatch(stopLoading());
              return of(registrationFailure({ error }));
            })
          );
      })
    )
  );

  exit = createEffect(() =>
    this.actions$.pipe(
      ofType(exitAction),
      tap(() => this.store.dispatch(startLoading())),
      exhaustMap((actionData) => {
        return this.http
          .get(`${environment.apiBaseUrl}/user/logout`, {
            withCredentials: true,
          })
          .pipe(
            map((data) => {
              this.store.dispatch(stopLoading());
              this.toast.success('Вы успешно вышли, возращайтесь!');
              this.router.navigateByUrl('registration');
              return completedExit(data);
            }),
            catchError((error) => {
              const errorMessage = error.error.message;
              this.toast.error(errorMessage);
              this.store.dispatch(stopLoading());
              return of(registrationFailure({ error }));
            })
          );
      })
    )
  );

  login = createEffect(() =>
    this.actions$.pipe(
      ofType(startLogin),
      tap(() => this.store.dispatch(startLoading())),
      exhaustMap((actionData) => {
        return this.http
          .post(
            `${environment.apiBaseUrl}/user/login`,
            {
              name: actionData.name,
              password: actionData.password,
              email: actionData.email,
            },
            { withCredentials: true }
          )
          .pipe(
            map((data: any) => {
              this.store.dispatch(stopLoading());
              this.toast.success(data.message);
              this.router.navigateByUrl('/');
              return completedLogin(data);
            }),
            catchError((error) => {
              const errorMessage = error.error.message;
              this.toast.error(errorMessage);
              this.store.dispatch(stopLoading());
              return of(registrationFailure({ error }));
            })
          );
      })
    )
  );
}
