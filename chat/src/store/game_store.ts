import { defineStore } from 'pinia';
import { useToast } from 'vue-toastification';

interface GameRoom {
  id: string;
  roomWithPlayer: string;
  dataGames: Object;
  games: {
    usersOnline: number;
    totalUsers: number;
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
    dataGames: Object;
    roomWithPlayer: string;
    id: string;
    games: { totalUsers: number; game: string; usersOnline: number }[];
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
  getters: {
    getTicTacToe(state) {
      const currentGame = 'ticTacToe' as string;
      const currentRoom = state.gameRooms.find((room) => room.id === state.currentGameRoom);
      if (currentRoom) {
        return currentRoom?.games.reduce((acc: any, curr: any) => {
          if (curr.game === currentGame) {
            return (acc = {
              ...curr,
              data: currentRoom.dataGames[currentGame as keyof typeof currentRoom.dataGames],
            });
          }
        }, {});
      }
    },
  },
  actions: {
    setCurrentRoomId(id: string): void {
      this.currentGameRoom = id;
    },
    setGameRoom(data: RequestGameRoomType) {
      const newRoom = {
        id: data.gameRoom.id,
        roomWithPlayer: data.gameRoom.roomWithPlayer,
        dataGames: data.gameRoom.dataGames || {},
        games: data.gameRoom.games,
      };
      this.gameRooms.push(newRoom);
    },
    setDataGame(data: any) {
      const currentRoom = this.gameRooms.find((room) => room.id === data.roomId);
      if (currentRoom) {
        currentRoom.dataGames[data.game as keyof typeof currentRoom.dataGames] = data.dataGame;
      }
    },
    removeLeavedRoom(roomId: string) {
      this.gameRooms = this.gameRooms.filter((room) => room.id !== roomId);
    },
  },
});
