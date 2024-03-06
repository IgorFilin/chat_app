import { defineStore } from 'pinia';
import { useToast } from 'vue-toastification';

interface GameStoreType {
  currentGameRoom: string;
  gameRooms: {
    [roomId: string]: {
        [game: string]: {
          data: any
          usersOnline: number
          totalUsers: number
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
            ticktac: {
              data: 'test',
              usersOnline: 1,
              totalUsers: 2,
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
          [requestGamePayload.game]:{
            data: requestGamePayload.dataGame.data,
            usersOnline: requestGamePayload.dataGame.usersOnline,
            totalUsers: requestGamePayload.dataGame.totalUsers,
          }
        }
      }
    },
  },
});
