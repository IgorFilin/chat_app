import { defineStore } from 'pinia';
import { useToast } from 'vue-toastification';
import { io } from 'socket.io-client';
import { useGameStore } from '@/store/game_store.ts';
import router from '@/router/router';
interface SocketStoreType {
  socket: any;
  socketConnected: boolean;
}

const toast = useToast();

export const useSocketStore: any = defineStore('socket_store', {
  state: () => {
    return {
      socket: null,
      socketConnected: false,
      onlineClients: [] as Array<UserTypeInUsersArrayType>,
      isAllChat: true as boolean,
      roomId: null as string | null,
      userToAddPrivate: '' as string,
      messages: [] as Array<MessageType>,
      onDragClass: false as boolean,
      isLoadingMessages: false as boolean,
      popupInviteGameData: {} as any,
      isOpenPopupInviteGame: false as boolean,
      messagesLength: 0,
    } as any;
  },
  getters: {},
  actions: {
    async connectSocket(userId: string) {
      const address = `${import.meta.env.VITE_APP_PROTOCOL}://${import.meta.env.VITE_APP_DOMEN_PORT}?userID=${userId}`;
      this.socket = io(address);
      this.socketEmits();
    },
    setConnectionSocket(value: boolean) {
      this.socketConnected = value;
    },
    socketEmits() {
      const gameStore = useGameStore();

      this.socket.on('connect', () => {
        this.socketConnected = true;
      });

      this.socket.on('disconnect', () => {
        // socketStore.setConnectionSocket(socket, false);
        // if (
        //   router.currentRoute.value.matched[0].path !== '/games/:id' &&
        //   router.currentRoute.value.matched[0].path !== '/profile/:id' &&
        //   router.currentRoute.value.path !== '/login'
        // ) {
        //   authStore.toast('К сожалению соединение разорвано');
        // }
      });

      this.socket.on('clients', (data: any) => {
        this.onlineClients = data.clients;
      });

      this.socket.on('message', (responseData: any) => {
        const data = responseData;

        if (data.openRoom) {
          this.roomId = data.messages.roomId;
        }

        if (data.lengthMessages !== this.messagesLength) {
          this.messagesLength = data.lengthMessages;
        }

        if (data.userToAddPrivat && data.userToAddPrivat !== this.userToAddPrivate) {
          this.userToAddPrivate = data.userToAddPrivat;
        }

        if (data.messages?.roomId === this.roomId) {
          if (Array.isArray(data.messages?.message)) {
            const bufferData = new Uint8Array(data.messages.message);
            const blobMessage = new Blob([bufferData]);
            data.messages.message = URL.createObjectURL(blobMessage);
          }

          if (typeof data.messages?.message === 'string') {
            const base64Image = data.messages.userPhoto;
            const binaryData = Uint8Array.from(atob(base64Image), (c) => c.charCodeAt(0));
            const blobImage = new Blob([binaryData]);
            data.messages.userPhoto = URL.createObjectURL(blobImage);
            this.messages.unshift(data.messages);
          }
        }

        if (this.messagesLength === this.messages.length) {
          this.isLoadingMessages = true;
        }
      });

      this.socket.on('inviteGame', (data: any) => {
        if (data.isInvite) {
          const TypeNameGames = {
            ticTacToe: 'Крестики нолики',
          } as any;

          this.popupInviteGameData = {
            title: `Вас пригласил ${data.userSendedInvite} в&nbsp;игру&nbsp;${TypeNameGames[data.game]}`,
            game: data.inviteGame,
            sendInviteUserId: data.sendInviteUserId,
          };
          this.isOpenPopupInviteGame = true;
        }

        if (typeof data.isAccept == 'boolean') {
          const answer = data.isAccept ? 'принял' : 'отклонил';
          toast(`Пользователь ${data.userSendedInvite} ${answer} предложение`);
        }

        if (data.gameRoom) {
          gameStore.setGameRoom(data);
        }
      });

      this.socket.on('setGameRooms', (data: any) => {
        for (const roomData of data.rooms) {
          gameStore.setGameRoom(roomData);
        }
      });

      this.socket.on('gaming', (data: any) => {
        if (data.roomId === gameStore.currentGameRoom) gameStore.setDataGame(data);
      });

      this.socket.on('actionGameRoom', (data: any) => {
        if (data.roomId) {
          console.log(data.roomId);
          gameStore.setCurrentRoomId(data.roomId);
          router.push(`/games/${data.roomId}`);
        }
      });
    },
  },
});
