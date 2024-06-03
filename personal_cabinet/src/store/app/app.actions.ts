import { createAction } from '@ngrx/store';

export const isOpenedClosedMenuAction = createAction(
  '[APP] Open Close menu',
  (status: boolean) => ({ status })
);
