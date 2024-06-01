import { createAction } from '@ngrx/store';
import { ResponseDataRegistrationType } from './types';

// Регистрация
export const startRegistrationAction = createAction(
  '[Auth] Start Registration',
  (data) => data
);

export const completedExit = createAction(
  '[Auth] Exit Complited',
  (data) => data
);

export const startLogin = createAction('[Auth] Login Start', (data) => data);

export const completedLogin = createAction(
  '[Auth] Login Complited',
  (data) => data
);

export const completedRegistrationAction = createAction(
  '[Auth] Completed Registration',
  (data: ResponseDataRegistrationType) => {
    return data;
  }
);

export const registrationFailure = createAction(
  '[Auth] Registration Failure',
  (data) => data
);

// Выход
export const exitAction = createAction('[Auth] Exit');

// Авторизация
export const authAction = createAction('[Auth] Auth Action');

// Подтверждение регистрации
export const registrationConfirm = createAction(
  '[Auth] Registration Start Confirm',
  (data) => data
);

// Загрузка
export const startLoading = createAction('[UI] Start Loading');
export const stopLoading = createAction('[UI] Stop Loading');
