import { defineStore } from 'pinia';
import { useToast } from 'vue-toastification';

interface GameStoreType {
  gameRoomId: string;
  games: {
    [game: string]: any;
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
    setGame(data: { roomId: string; game: string; dataGame: Array<any> }) {
      this.games[data.game] = data.dataGame;
    },
  },
});
