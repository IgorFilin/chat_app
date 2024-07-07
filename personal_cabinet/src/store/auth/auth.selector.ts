import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthType } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthType>('auth');

export const getIsAuth = createSelector(
  selectAuthState,
  (state: AuthType) => state.isAuth
);
