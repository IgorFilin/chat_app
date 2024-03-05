import { defineStore } from 'pinia';
import { useToast } from 'vue-toastification';

interface GameStoreType {
  currentGameRoom: string;
  gameRooms: {
    [roomId: string]: {
      games: {
        [game: string]: {
          data: any
          usersOnline: number
          totalUsers: number
        };
      };
    };
  };
}

interface RequestGameRoomType {
  secondPlayer:string
  roomId: string;
  game: string;
  dataGame: {
    data: Object,
    usersOnline: number,
    totalUsers: number,
  }
}

const toast = useToast();



export const useGameStore: any = defineStore('game_store', {
  state: () => {
    return {
      currentGameRoom: '',
      gameRooms: {
        '11231231231235123513123': {
          roomName: 'c Алексеем',
          games: {
            ticktac: {
              data: 'test',
              usersOnline: 1,
              totalUsers: 2,
            },
            МорскойБой: {
              data: 'test',
              usersOnline: 0,
              totalUsers: 2,
            },
          },
        },
        '11231123331235123513123': {
          roomName: 'c Валерией',
          games: {
            ticktac: {
              data: 'test',
              usersOnline: 1,
              totalUsers: 2,
            },
            МорскойБой: {
              data: 'test',
              usersOnline: 1,
              totalUsers: 2,
            },
          },
        },
        '241242342637456756734523': {
          roomName: 'c Алёной',
          games: {
            ticktac: {
              data: 'test',
              usersOnline: 1,
              totalUsers: 2,
            },
          },
        },
        '323434756823423423467345': {
          roomName: 'c Николаем',
          games: {
            ticktac: {
              data: 'test',
              usersOnline: 1,
              totalUsers: 2,
            },
          },
        },
        '4776234523423263463453453': {
          roomName: 'c Бобом',
          games: {
            ticktac: {
              data: 'test',
              usersOnline: 1,
              totalUsers: 2,
            },
          },
        },
      },
    } as GameStoreType;
  },
  getters: {},
  actions: {
    setCurrentRoomId(id: string):void {
      this.currentGameRoom = id;
    },
    setGameRoom(requestGamePayload: RequestGameRoomType) {
      // this.gameRooms[data.roomId].games = data.dataGame;
      if(this.gameRooms[requestGamePayload.roomId]) return

      this.gameRooms[requestGamePayload.roomId] = {
        roomName: requestGamePayload.secondPlayer,
        games: {
          data: requestGamePayload.dataGame.data,
          usersOnline: requestGamePayload.dataGame.usersOnline,
          totalUsers: requestGamePayload.dataGame.totalUsers,
        }
      }
    },
  },
});
