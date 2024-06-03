import { createReducer, on } from '@ngrx/store';
import { isOpenedClosedMenuAction } from './app.actions';

export interface InitialAppStateType {
  isOpenMenu: boolean;
}

const initialAppState: InitialAppStateType = {
  isOpenMenu: false,
};

export const AppReducer = createReducer(
  initialAppState,
  on(isOpenedClosedMenuAction, (state, { status }) => {
    return {
      ...state,
      isOpenMenu: status,
    };
  })
);
