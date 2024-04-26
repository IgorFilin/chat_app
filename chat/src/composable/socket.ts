import { reactive } from 'vue';
import { io } from 'socket.io-client';
import { useAuthStore } from '@/store/auth_store.ts';
import router from '@/router/router';
import { useGameStore } from '@/store/game_store.ts';
import { useSocketStore } from '@/store/socket_store.ts';

export function webSocketEntity() {
  const authStore = useAuthStore();
  const gameStore = useGameStore();
  const socketStore = useSocketStore();

  const state = reactive({
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
  });

  socketStore.socket.on('connect', () => {
    socketStore.setConnectionSocket(true);
  });

  socketStore.socket.on('disconnect', () => {
    // socketStore.setConnectionSocket(socket, false);
    if (
      router.currentRoute.value.matched[0].path !== '/games/:id' &&
      router.currentRoute.value.matched[0].path !== '/profile/:id' &&
      router.currentRoute.value.path !== '/login'
    ) {
      authStore.toast('К сожалению соединение разорвано');
    }
  });

  socketStore.socket.on('clients', (data) => {
    state.onlineClients = data.clients;
  });

  socketStore.socket.on('message', (responseData) => {
    const data = responseData;

    if (data.openRoom) {
      state.roomId = data.messages.roomId;
    }

    if (data.lengthMessages !== state.messagesLength) {
      state.messagesLength = data.lengthMessages;
    }

    if (data.userToAddPrivat && data.userToAddPrivat !== state.userToAddPrivate) {
      state.userToAddPrivate = data.userToAddPrivat;
    }

    if (data.messages?.roomId === state.roomId) {
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
        state.messages.unshift(data.messages);
      }
    }

    if (state.messagesLength === state.messages.length) {
      state.isLoadingMessages = true;
    }
  });

  socketStore.socket.on('inviteGame', (data) => {
    if (data.isInvite) {
      const TypeNameGames = {
        ticTacToe: 'Крестики нолики',
      } as any;
      state.popupInviteGameData = {
        title: `Вас пригласил ${data.userSendedInvite} в&nbsp;игру&nbsp;${TypeNameGames[data.game]}`,
        game: data.inviteGame,
        sendInviteUserId: data.sendInviteUserId,
      };
      state.isOpenPopupInviteGame = true;
    }

    if (data.isAccept !== undefined) {
      const answer = data.isAccept ? 'принял' : 'отклонил';
      authStore.toast(`Пользователь ${data.userSendedInvite} ${answer} предложение`);
    }

    if (data.gameRoom) {
      gameStore.setRoomId(data.gameRoom.id);
    }
  });

  socketStore.socket.on('gaming', (data) => {
    gameStore.setGame(data);
  });

  socketStore.socket.on('actionGameRoom', (data) => {
    console.log(data);
  });

  return { state };
}
