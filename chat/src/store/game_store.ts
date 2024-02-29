import { defineStore } from 'pinia';
import { useToast } from 'vue-toastification';

interface GameStoreType {
  currentGameRoom: string;
  gameRooms: {
    [roomId: string]: {
      games: {
        [game: string]: any;
      };
    };
  };
}

const toast = useToast();

export const useGameStore: any = defineStore('game_store', {
  state: () => {
    return {
      currentGameRoom: '',
      gameRooms: {
        11231231231235123513123: {
          roomName: 'c Алексеем',
          games: {
            ticktac: {
              data: 'test',
            },
            МорскойБой: {
              data: 'test',
            },
          },
        },
        241242342637456756734523: {
          roomName: 'c Алёной',
          games: {
            ticktac: {
              data: 'test',
            },
          },
        },
        323434756823423423467345: {
          roomName: 'c Николаем',
          games: {
            ticktac: {
              data: 'test',
            },
          },
        },
        4776234523423263463453453: {
          roomName: 'c Бобом',
          games: {
            ticktac: {
              data: 'test',
            },
          },
        },
      },
    } as GameStoreType;
  },
  getters: {},
  actions: {
    setCurrentRoomId(id: string) {
      this.currentGameRoom = id;
    },
    setGame(data: { roomId: string; game: string; dataGame: Array<any> }) {
      this.gameRooms[data.roomId].games = data.dataGame;
    },
  },
});
