<template>
  <div
    class="v-mainPage"
    :class="{ activeContainer: isActiveContainer }"
  >
    <UserOnlineContainer
      @openRoom="openRoomHandler"
      @sendInviteGame="sendInviteGameHandler"
      @isActiveContainer="(value) => (isActiveContainer = value)"
      :usersOnline="socketStore.onlineClients"
    />
    <div
      v-if="!socketStore.isAllChat"
      class="v-mainPage__backAllChatContainer"
    >
      <Button
        @onClick="goToPublicChat"
        text="В общий чат"
        isIcon
        iconId="arrow_back"
        iconColor="white"
      />
      <div>В диалоге {{ socketStore.userToAddPrivate }}</div>
    </div>
    <div
      class="v-mainPage__chatContainer"
      :class="{ drag: socketStore.onDragClass }"
      @scroll="onScroll"
      @dragstart.prevent
      @dragover.prevent="OnDragChatContainer"
      @dragleave.prevent="socketStore.onDragClass = false"
      @drop.prevent="OnDropChatContainer"
    >
      <Message
        v-if="socketStore.isLoadingMessages"
        :key="message.message.toString()"
        v-for="message in memoMessages"
        v-bind="message"
      />
      <Loader
        v-else
        loaderFor="message"
      />
    </div>
    <InputSendButton
      @sendFile="OnDropChatContainer"
      @sendMessage="sendMessage"
    />
    <Transition name="popup">
      <Popup
        v-if="socketStore.isOpenPopupInviteGame"
        class="v-mainPage__inviteGamePopup"
        :title="socketStore.popupInviteGameData.title"
        isCloseBtn
        @onClose="socketStore.isOpenPopupInviteGame = false"
      >
        <template #additional>
          <div class="v-mainPage__inviteGamePopupBtns">
            <Button
              v-for="({ text, isAccept }, index) in inviteGameButtons"
              :key="index"
              :text="text"
              @click.prevent="
                sendInviteGameHandler(
                  socketStore.popupInviteGameData.sendInviteUserId,
                  socketStore.popupInviteGameData.game,
                  isAccept
                )
              "
            />
          </div>
        </template>
      </Popup>
    </Transition>
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
import { useSocketStore } from '@/store/socket_store.ts';

const socketStore = useSocketStore();
const store = useAuthStore();

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

const isActiveContainer = ref(false);

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
      roomId: socketStore.roomId,
      isAllChat: socketStore.isAllChat,
    },
  };
  socketStore.socket.emit('message', sendMessage);
}

function OnDropChatContainer(e: any) {
  console.log(e);
  e.preventDefault();

  socketStore.onDragClass = false;
  const file = e.dataTransfer?.files[0] || e.target?.files[0];
  const reader = new FileReader();
  if (
    file.type === 'text/plain' ||
    file.type === 'application/pdf' ||
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    store.toast('К сожалению пока не поддерживаемый формат файлов');
    return;
  } // Добавить возможность сохранения текстовых файлов для клиентов

  if (file.type !== 'image/webp' && file.type !== 'image/png' && file.type !== 'image/jpeg') {
    store.toast(
      'К сожалению пока не поддерживаемый формат файлов (Доступны только изображения форматов png, webp, jpeg)'
    );
    return;
  }

  if (file.size > 300 * 1024) {
    store.toast('Изображение слишком большое. Максимальный размер - 300 КБ.');
    return;
  }

  reader.onload = function (eventReader) {
    const arrayBuffer = eventReader.target?.result;
    socketStore.socket.emit('message', {
      data: {
        message: Array.from(new Uint8Array(arrayBuffer as ArrayBuffer)),
        id: store.id,
        roomId: socketStore.roomId,
        isAllChat: socketStore.isAllChat,
      },
    });
  };

  reader.readAsArrayBuffer(file);
}

watch(
  [() => socketStore.isAllChat, () => socketStore.roomId],
  () => (socketStore.isLoadingMessages = socketStore.messagesLength === socketStore.messages.length)
);

const memoMessages = computed(() => socketStore.messages);

function OnDragChatContainer(event: any) {
  event.preventDefault();
  if (!socketStore.onDragClass) {
    socketStore.onDragClass = true;
  }
}

function goToPublicChat() {
  socketStore.isAllChat = true;
  socketStore.roomId = null;
  socketStore.messages = [];
  socketStore.socket.emit('getAllMessages', {
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
  socketStore.isAllChat = false;
  socketStore.messages = [];
  socketStore.socket.emit('openRoom', { data: { myId: store.id, userId: id } });
}

function sendInviteGameHandler(userId: string, game: string, isAccept: boolean | undefined) {
  socketStore.isOpenPopupInviteGame = false;
  socketStore.socket.emit('inviteGame', { myId: store.id, userId, game, isAccept });
}

onMounted(() => {
  socketStore.socket.connect();
});

onUnmounted(() => {
  // if (
  //   router.currentRoute.value.matched[0].path !== '/games/:id' &&
  //   router.currentRoute.value.matched[0].path !== '/games/'
  // ){}
  // socket.close();
});
</script>

<style lang="scss">
.v-mainPage {
  display: grid;
  grid-template-areas:
    'users chat'
    'users buttons';
  grid-template-columns: 250px 1fr;
  grid-template-rows: 85vh 55px;
}

.v-mainPage__chatContainer {
  justify-self: center;
  grid-area: chat;
  display: flex;
  flex-direction: column-reverse;
  padding: 20px;
  width: 95%;
  max-height: 100%;
  max-width: 1400px;
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

.v-mainPage__inviteGamePopupBtns {
  display: flex;
  justify-content: space-between;
  width: 100%;

  .v-button {
    min-width: 180px;

    &:nth-child(2) {
      background: $redPepper;
      color: $darkBlack;
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
  transform: translate3d(0, 0, 0);

  &.popup-enter-active {
    @include animation(open-popup);
  }

  &.popup-leave-active {
    @include animation(accept-popup-close);
  }
}
</style>
