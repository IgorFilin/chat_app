import { signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { IUserState } from '../models';
import { withUserMethods } from './user.methods';
import { withUserSelectors } from './user.selector';

const initialUserState: IUserState = {
  userInfo: null,
};

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState(initialUserState),
  withUserSelectors(),
  withUserMethods()
)