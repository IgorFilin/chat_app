import { computed } from '@angular/core';

import { signalStoreFeature, withComputed, type } from '@ngrx/signals';
import { IUserState } from '../models';

export function withUserSelectors() {
  return signalStoreFeature(
    { state: type<IUserState>() },
    withComputed((state) => ({
      userInfoData: computed(() => state.userInfo),
      userId: computed(() => state.userInfo()?.id),
    }))
  )
}
