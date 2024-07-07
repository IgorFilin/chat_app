import { createFeatureSelector, createSelector } from '@ngrx/store';
import { InitialAppStateType } from './app.reducer';

export const SelectAppState = createFeatureSelector<InitialAppStateType>('app');

export const GetIsStatusMenu = createSelector(
  SelectAppState,
  (state: InitialAppStateType) => state.isOpenMenu
);
