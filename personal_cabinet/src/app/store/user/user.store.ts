import { signalStore, withMethods, withState } from '@ngrx/signals';
import { IUserState } from '../models';
import { userMethods } from './user.methods';

const initialUserState: IUserState = {
  id: '22',
};

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState(initialUserState),
  withMethods(userMethods())
);