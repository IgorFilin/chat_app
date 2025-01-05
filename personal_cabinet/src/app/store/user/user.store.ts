import { signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { IUserState } from '../models';
import { userMethods } from './user.methods';
import { userSelector } from './user.selector';

const initialUserState: IUserState = {
  userInfo: null,
};

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState(initialUserState),
  withMethods(userMethods()),
  withComputed(userSelector())
)