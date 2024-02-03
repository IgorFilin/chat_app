import { defineStore } from 'pinia';
import { userApi } from '@/api/appApi';
import { useToast } from 'vue-toastification';
import { errorStore } from '@/utils/storeError';

interface GameStoreType {
  gameRoomId: string;
  games: {
    [game: string]: Array<any>;
  };
}

const toast = useToast();

export const useGameStore: any = defineStore('game_store', {
  state: () => {
    return {
      gameRoomId: '',
      games: {},
    } as GameStoreType;
  },
  getters: {},
  actions: {
    setRoomId(id: string) {
      this.gameRoomId = id;
    },
    setGame(data: { game: string; dataGame: Array<any> }) {
      this.games[data.game] = data.dataGame;
    },
  },
});
