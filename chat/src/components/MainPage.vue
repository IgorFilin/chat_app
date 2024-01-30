<template>
  <div class="container">
    <UserOnlineContainer
      @openRoom="openRoomHandler"
      @sendInviteGame="sendInviteGameHandler"
      :usersOnline="usersOnline" />
    <div
      v-if="!isAllChat"
      class="v-mainPage__backAllChatContainer">
      <Button
        @onClick="goToPublicChat"
        text="В общий чат"
        isIcon
        iconId="arrow_back"
        iconColor="white" />
      <div>В диалоге {{ userToAddPrivate }}</div>
    </div>
    <div
      class="v-mainPage__chatContainer"
      :class="{ drag: onDragClass }"
      @scroll="onScroll"
      @dragstart.prevent
      @dragover.prevent="OnDragChatContainer"
      @dragleave.prevent="onDragClass = false"
      @drop.prevent="OnDropChatContainer">
      <Message
        v-if="isLoadingMessages"
        :key="message.message.toString()"
        v-for="message in memoMessages"
        v-bind="message" />
      <Loader
        v-else
        loaderFor="message" />
    </div>
    <InputSendButton @sendMessage="sendMessage" />
    <Popup
      v-if="isOpenPopupInviteGame"
      class="v-mainPage__inviteGamePopup"
      :title="popupInviteGameData.title"
      isCloseBtn
      @onClose="isOpenPopupInviteGame = false">
      <template #additional>
        <Button
          v-for="({ text, isAccept }, index) in inviteGameButtons"
          :key="index"
          :text="text"
          @click.prevent="sendInviteGameHandler(popupInviteGameData.sendInviteUserId, popupInviteGameData.game, isAccept)" />
      </template>
    </Popup>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/auth_store.ts';
import InputSendButton from '@/components/InputSendButton.vue';
import router from '@/router/router';
import { Ref, computed, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue';
import Message from '@/components/Message.vue';
import UserOnlineContainer from '@/components/UserOnlineContainer/UserOnlineContainer.vue';
import Loader from '@/components/Loader.vue';
import Button from '@/components/assetsComponent/Button.vue';
import Popup from '@/components/assetsComponent/Popup.vue';
import { useGameStore } from '@/store/game_store.ts';
import { webSocketEntity } from '@/composable/socket.ts';

const isAllChat = ref(true) as Ref<boolean>;
const roomId = ref(null) as Ref<string | null>;
const userToAddPrivate = ref('') as Ref<string>;
const messages = ref([]) as Ref<Array<MessageType>>;
const usersOnline = ref([]) as Ref<Array<UserTypeInUsersArrayType>>;
const onDragClass = ref(false) as Ref<boolean>;
const isLoadingMessages = ref(false) as Ref<boolean>;
const messagesLength = ref(0);
const isOpenPopupInviteGame = ref(false);

const { socket, state } = webSocketEntity();

const popupInviteGameData = ref({
  title: '',
  game: '',
  sendInviteUserId: '',
});

const inviteGameButtons = [
  {
    text: 'Принять приглашение',
    isAccept: true,
  },
  {
    text: 'Отказаться',
    isAccept: false,
  },
];

const store = useAuthStore();
const gameStore = useGameStore();

if (!store.isAuth) {
  router.push('/login');
}

// onRenderTriggered(({ key, target, type }) =>
//   console.log({ key, target, type })
// ); // Тест производительности

// const connection = new WebSocket(`${import.meta.env.VITE_APP_PROTOCOL}://${import.meta.env.VITE_APP_DOMEN_PORT}?userID=${store.id}`);

// connection.onclose = function (event) {
//   if (router.currentRoute.value.matched[0].path !== '/games/:id' && router.currentRoute.value.matched[0].path !== '/profile/:id' && router.currentRoute.value.path !== '/login') {
//     store.toast('К сожалению соединение разорвано');
//   }
// };

function sendMessage(message: string) {
  if (connection.readyState === 1 && message !== '') {
    connection.send(
      JSON.stringify({
        event: 'message',
        data: {
          message: message.trim(),
          id: store.id,
          roomId: roomId.value,
          isAllChat: isAllChat.value,
        },
      })
    );
  }
}

function OnDropChatContainer(e: any) {
  e.preventDefault();

  onDragClass.value = false;
  const file = e.dataTransfer.files[0];
  const reader = new FileReader();

  // if (file.type === 'text/plain' || file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
  //   store.toast('К сожалению пока не поддерживаемый формат файлов');
  //   return;
  // }  // Добавить возможность сохранения текстовых файлов для клиентов

  if (file.type !== 'image/webp' && file.type !== 'image/png' && file.type !== 'image/jpeg') {
    store.toast('К сожалению пока не поддерживаемый формат файлов (Доступны только изображения форматов png и webp)');
    return;
  }

  if (file.size > 600 * 1024) {
    store.toast('Изображение слишком большое. Максимальный размер - 600 КБ.');
    return;
  }

  reader.onload = function (eventReader) {
    const arrayBuffer = eventReader.target?.result;
    if (connection.readyState === 1) {
      connection.send(
        JSON.stringify({
          event: 'message',
          data: {
            message: Array.from(new Uint8Array(arrayBuffer as ArrayBuffer)),
            id: store.id,
            roomId: roomId.value,
            isAllChat: isAllChat.value,
          },
        })
      );
    }
  };
  reader.readAsArrayBuffer(file);
}

watch([() => isAllChat.value, () => roomId.value], () => (isLoadingMessages.value = messagesLength.value === messages.value.length));

const memoMessages = computed(() => messages.value);

// connection.onmessage = function (event) {
//   const data = JSON.parse(event.data);

//   if (data.openRoom) {
//     roomId.value = data.messages.roomId;
//   }

//   if (data.lengthMessages !== messagesLength.value) {
//     messagesLength.value = data.lengthMessages;
//   }

//   if (data.userToAddPrivat && data.userToAddPrivat !== userToAddPrivate.value) {
//     userToAddPrivate.value = data.userToAddPrivat;
//   }

//   if (data.messages?.roomId === roomId.value) {
//     if (Array.isArray(data.messages?.message)) {
//       const bufferData = new Uint8Array(data.messages.message);
//       const blobMessage = new Blob([bufferData]);
//       data.messages.message = URL.createObjectURL(blobMessage);
//     }

//     if (typeof data.messages?.message === 'string') {
//       const base64Image = data.messages.userPhoto;
//       const binaryData = Uint8Array.from(atob(base64Image), (c) => c.charCodeAt(0));
//       const blobImage = new Blob([binaryData]);
//       data.messages.userPhoto = URL.createObjectURL(blobImage);
//       messages.value.unshift(data.messages);
//     }
//   }

//   if (messagesLength.value === messages.value.length) {
//     isLoadingMessages.value = true;
//   }

//   if (data.clients) {
//     usersOnline.value = data.clients;
//   }

//   if (data.isInvite) {
//     const TypeNameGames = {
//       ticTackToe: 'Крестики нолики',
//     } as any;

//     popupInviteGameData.value = {
//       title: `Вас пригласил ${data.userSendedInvite} в&nbsp;игру&nbsp;${TypeNameGames[data.inviteGame]}`,
//       game: data.inviteGame,
//       sendInviteUserId: data.sendInviteUserId,
//     };
//     isOpenPopupInviteGame.value = true;
//   }

//   if (data.isAccept !== undefined) {
//     const answer = data.isAccept ? 'принял' : 'отклонил';
//     store.toast(`Пользователь ${data.userSendedInvite} ${answer} предложение`);
//   }

//   if (data.gameRoomId) {
//     gameStore.setRoomId(data.gameRoomId);
//   }
// };

function OnDragChatContainer(event: any) {
  event.preventDefault();
  if (!onDragClass.value) {
    onDragClass.value = true;
  }
}

function goToPublicChat() {
  isAllChat.value = true;
  roomId.value = null;
  messages.value = [];
  // if (connection.readyState === 1) {
  //   connection.send(
  //     JSON.stringify({
  //       event: 'all_messages_public',
  //       data: { id: store.id },
  //     })
  //   );
  // }
}

function onScroll(event: any) {
  const container = event.target as HTMLElement; // Получаем контейнер, на который произошло событие скроллинга
  // Проверяем, достиг ли пользователь нижней границы контейнера
  if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
    // Достигнут конец страницы
  }
}

function openRoomHandler(id: string) {
  isAllChat.value = false;
  messages.value = [];
  // if (connection.readyState === 1) {
  //   connection.send(
  //     JSON.stringify({
  //       event: 'open_room',
  //       data: { myId: store.id, userId: id },
  //     })
  //   );
  // }
}

function sendInviteGameHandler(userId: string, game: string, isAccept: boolean | undefined) {
  // if (connection.readyState === 1) {
  //   connection.send(
  //     JSON.stringify({
  //       event: 'invite_game',
  //       data: { myId: store.id, userId, game, isAccept },
  //     })
  //   );
  // }
  isOpenPopupInviteGame.value = false;
}
onMounted(() => {
  socket.connect();
});

onUnmounted(() => {
  // connection.close();
});
</script>

<style lang="scss">
.v-mainPage__chatContainer {
  display: flex;
  flex-direction: column-reverse;
  padding: 20px;
  width: 74%;
  height: 650px;
  overflow-y: auto;
  gap: 10px;

  &::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background-color: rgb(51, 51, 51);
    min-height: 24px;
    border: 3px solid rgb(245, 245, 245);
  }

  &::-webkit-scrollbar {
    width: 0.9rem;
  }

  &.drag {
    opacity: 0.4;
  }
}

.v-mainPage__buttonBackAllChat {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: #141416;
  transition: 0.3s;
  border: none;
  color: white;
  padding: 5px 10px;
  margin: 0;
  gap: 10px;
  height: 30px;

  &:hover {
    border: none;
    transition: 0.3s;
    color: #000;
    background-color: #fff;

    .v-icon {
      color: #000;
    }
  }
}

.v-mainPage__backAllChatContainer {
  display: flex;
  align-items: center;
  width: 80%;
  margin: 10px 0;
  gap: 10px;
}

.v-mainPage__inviteGamePopup {
  position: absolute;
  min-width: 350px;

  .v-popup__title {
    font-size: 20px;
    text-align: center;
  }
}
</style>
