<template>
  <div class="container">
    <UserOnlineContainer
      @openRoom="openRoomHandler"
      @sendInviteGame="sendInviteGameHandler"
      :usersOnline="state.onlineClients" />
    <div
      v-if="!state.isAllChat"
      class="v-mainPage__backAllChatContainer">
      <Button
        @onClick="goToPublicChat"
        text="В общий чат"
        isIcon
        iconId="arrow_back"
        iconColor="white" />
      <div>В диалоге {{ state.userToAddPrivate }}</div>
    </div>
    <div
      class="v-mainPage__chatContainer"
      :class="{ drag: state.onDragClass }"
      @scroll="onScroll"
      @dragstart.prevent
      @dragover.prevent="OnDragChatContainer"
      @dragleave.prevent="state.onDragClass = false"
      @drop.prevent="OnDropChatContainer">
      <Message
        v-if="state.isLoadingMessages"
        :key="message.message.toString()"
        v-for="message in memoMessages"
        v-bind="message" />
      <Loader
        v-else
        loaderFor="message" />
    </div>
    <InputSendButton @sendMessage="sendMessage" />
    <Popup
      v-if="state.isOpenPopupInviteGame"
      class="v-mainPage__inviteGamePopup"
      :title="state.popupInviteGameData.title"
      isCloseBtn
      @onClose="state.isOpenPopupInviteGame = false">
      <template #additional>
        <Button
          v-for="({ text, isAccept }, index) in inviteGameButtons"
          :key="index"
          :text="text"
          @click.prevent="sendInviteGameHandler(state.popupInviteGameData.sendInviteUserId, state.popupInviteGameData.game, isAccept)" />
      </template>
    </Popup>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/auth_store.ts';
import InputSendButton from '@/components/InputSendButton.vue';
import router from '@/router/router';
import { Ref, computed, onMounted, onUnmounted, onUpdated, ref, watch, watchEffect } from 'vue';
import Message from '@/components/Message.vue';
import UserOnlineContainer from '@/components/UserOnlineContainer/UserOnlineContainer.vue';
import Loader from '@/components/Loader.vue';
import Button from '@/components/assetsComponent/Button.vue';
import Popup from '@/components/assetsComponent/Popup.vue';
import { useGameStore } from '@/store/game_store.ts';
import { webSocketEntity } from '@/composable/socket.ts';

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

function sendMessage(message: string) {
  const sendMessage = {
    event: 'message',
    data: {
      message: message.trim(),
      id: store.id,
      roomId: state.roomId,
      isAllChat: state.isAllChat,
    },
  };
  socket.emit('message', sendMessage);
}

function OnDropChatContainer(e: any) {
  e.preventDefault();

  state.onDragClass = false;
  const file = e.dataTransfer.files[0];
  const reader = new FileReader();
  if (file.type === 'text/plain' || file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    store.toast('К сожалению пока не поддерживаемый формат файлов');
    return;
  } // Добавить возможность сохранения текстовых файлов для клиентов

  if (file.type !== 'image/webp' && file.type !== 'image/png' && file.type !== 'image/jpeg') {
    store.toast('К сожалению пока не поддерживаемый формат файлов (Доступны только изображения форматов png и webp)');
    return;
  }

  if (file.size > 300 * 1024) {
    store.toast('Изображение слишком большое. Максимальный размер - 300 КБ.');
    return;
  }

  reader.onload = function (eventReader) {
    const arrayBuffer = eventReader.target?.result;
    socket.emit('message', {
      data: {
        message: Array.from(new Uint8Array(arrayBuffer as ArrayBuffer)),
        id: store.id,
        roomId: state.roomId,
        isAllChat: state.isAllChat,
      },
    });
  };

  reader.readAsArrayBuffer(file);
}

watch([() => state.isAllChat, () => state.roomId], () => (state.isLoadingMessages = state.messagesLength === state.messages.length));

const memoMessages = computed(() => state.messages);

function OnDragChatContainer(event: any) {
  event.preventDefault();
  if (!state.onDragClass) {
    state.onDragClass = true;
  }
}

function goToPublicChat() {
  state.isAllChat = true;
  state.roomId = null;
  state.messages = [];
  socket.emit('getAllMessages', {
    event: 'all_messages_public',
    data: { id: store.id },
  });
}

function onScroll(event: any) {
  const container = event.target as HTMLElement; // Получаем контейнер, на который произошло событие скроллинга
  // Проверяем, достиг ли пользователь нижней границы контейнера
  if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
    // Достигнут конец страницы
  }
}

function openRoomHandler(id: string) {
  state.isAllChat = false;
  state.messages = [];
  socket.emit('openRoom', { data: { myId: store.id, userId: id } });
}

function sendInviteGameHandler(userId: string, game: string, isAccept: boolean | undefined) {
  state.isOpenPopupInviteGame = false;
  socket.emit('inviteGame', { myId: store.id, userId, game, isAccept });
}
onMounted(() => {
  socket.connect();
});

onUnmounted(() => {
  socket.close();
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
