import { defineStore } from 'pinia';
import { useToast } from 'vue-toastification';

interface GameRoom {
  id: string;
  roomWithPlayer: string;
  games: {
    usersOnline: number;
    totalUsers: number;
    data: Array<any>;
    game: string;
  }[];
}

interface GameStoreType {
  currentGameRoom: string;
  gameRooms: GameRoom[];
}

interface RequestGameRoomType {
  game: string;
  gameRoom: {
    roomWithPlayer: string;
    game: string;
    id: string;
    totalUsers: number;
    usersOnline: number;
  };
  inviteGame: string;
  sendInviteUserId: string;
  userSendedInvite: string;
}

const toast = useToast();

export const useGameStore: any = defineStore('game_store', {
  state: () => {
    return {
      currentGameRoom: '',
      gameRooms: [],
    } as GameStoreType;
  },
  getters: {},
  // interface GameRoom {
  //   [game: string]: {
  //     data: any;
  //     usersOnline: number;
  //     totalUsers: number;
  //   };
  // }
  actions: {
    setCurrentRoomId(id: string): void {
      this.currentGameRoom = id;
    },
    setGameRoom(data: RequestGameRoomType) {
      const newRoom = {
        id: data.gameRoom.id,
        roomWithPlayer: data.gameRoom.roomWithPlayer,
        games: [
          {
            usersOnline: data.gameRoom.usersOnline,
            totalUsers: data.gameRoom.totalUsers,
            data: [],
            game: data.gameRoom.game,
          },
        ],
      };
      this.gameRooms.push(newRoom);
      console.log(this.gameRooms);
    },
  },
});
