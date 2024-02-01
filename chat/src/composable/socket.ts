import { reactive } from 'vue';
import { io } from 'socket.io-client';
import { useAuthStore } from '@/store/auth_store.ts';
import router from '@/router/router';
import data from '@/components/ProfilePage/data';

export function webSocketEntity() {
  const store = useAuthStore();

  const state = reactive({
    connected: false,
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

  // "undefined" means the URL will be computed from the `window.location` object
  const address = `${import.meta.env.VITE_APP_PROTOCOL}://${import.meta.env.VITE_APP_DOMEN_PORT}?userID=${store.id}`;

  const socket = io(address);

  socket.on('connect', () => {
    state.connected = true;
  });

  socket.on('disconnect', () => {
    state.connected = false;
    if (router.currentRoute.value.matched[0].path !== '/games/:id' && router.currentRoute.value.matched[0].path !== '/profile/:id' && router.currentRoute.value.path !== '/login') {
      store.toast('К сожалению соединение разорвано');
    }
  });

  socket.on('clients', (data) => {
    state.onlineClients = data.clients;
  });

  socket.on('message', (responseData) => {
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

  socket.on('inviteGame', (data) => {
    console.log(data);
    if (data.isInvite) {
      const TypeNameGames = {
        ticTackToe: 'Крестики нолики',
      } as any;

      state.popupInviteGameData = {
        title: `Вас пригласил ${data.userSendedInvite} в&nbsp;игру&nbsp;${TypeNameGames[data.inviteGame]}`,
        game: data.inviteGame,
        sendInviteUserId: data.sendInviteUserId,
      };
      state.isOpenPopupInviteGame = true;
    }

    if (data.isAccept !== undefined) {
      const answer = data.isAccept ? 'принял' : 'отклонил';
      store.toast(`Пользователь ${data.userSendedInvite} ${answer} предложение`);
    }

    if (data.gameRoomId) {
      // state.gameStore.setRoomId(data.gameRoomId);
    }
  });

  return { state, socket };
}
