import { computed } from '@angular/core';

export function userSelector() {
  return (store: any) => ({
    userInfoData: computed(() => store.userInfo()),
  });
}
