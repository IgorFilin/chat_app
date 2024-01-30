import { defineStore } from 'pinia';
import { userApi } from '@/api/appApi';
import { useToast } from 'vue-toastification';
import { errorStore } from '@/utils/storeError';

interface GameStoreType {
  gameRoomId: string;
}

const toast = useToast();

export const useGameStore: any = defineStore('game_store', {
  state: () => {
    return {
      gameRoomId: '',
    } as GameStoreType;
  },
  getters: {},
  actions: {
    setRoomId(id: string) {
      this.gameRoomId = id;
    },
  },
});
