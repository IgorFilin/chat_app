import { defineStore } from 'pinia';

interface AppType {
  isOpenBurger: boolean;
}

export const useAppStore: any = defineStore('app_store', {
  state: () => {
    return {
      isAcceptKey: localStorage.getItem('isAcceptKey'),
      isOpenBurger: false,
    } as AppType;
  },
  getters: {},
  actions: {
    toggleBurger() {
      this.isOpenBurger = !this.isOpenBurger;
    },
  },
});
