<template>
  <div class="v-mainPage">
    <UserOnlineContainer
      @openRoom="openRoomHandler"
      :usersOnline="usersOnline"
    />
    <div
      v-if="currentChatEvent === 'private_message'"
      class="v-mainPage__backAllChatContainer"
    >
      <button @click="goToPublicChat" class="v-mainPage__buttonBackAllChat">
        <Icon id="arrow_back" color="white" />
        В общий чат
      </button>
      <div>В диалоге {{ userToAddPrivate }}</div>
    </div>
    <div
      class="v-mainPage__chatContainer"
      :class="{ drag: onDragClass }"
      @scroll="onScroll"
      @dragstart.prevent
      @dragover.prevent="OnDragChatContainer"
      @dragleave.prevent="onDragClass = false"
      @drop.prevent="OnDropChatContainer"
    >
      <Message
        :key="message.message.toString()"
        v-for="(message, index) in memoMessages"
        v-bind="message"
      />
      <!-- <Loader
        v-else
        loaderFor="message" /> -->
    </div>
    <!-- <div>"isLoadingMessages"{{ isLoadingMessages }}</div>
    <div>"messagesLength"{{ messagesLength }}</div>
    <div>"messages.length"{{ messages.length }}</div> -->
    <InputSendButton @sendMessage="sendMessage" />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/store/auth_store.ts";
import InputSendButton from "@/components/InputSendButton.vue";
import router from "@/router/router";
import { Ref, computed, onMounted, onUnmounted, ref, watch } from "vue";
import Message from "@/components/Message.vue";
import UserOnlineContainer from "@/components/UserOnlineContainer.vue";
import Loader from "@/components/Loader.vue";
import Icon from "@/components/Icon.vue";

let messagesLength = 0;

const currentChatEvent = ref("message") as Ref<"message" | "private_message">;
const privateRoomId = ref(null) as Ref<string | null>;
const userToAddPrivate = ref("") as Ref<string>;
const messages = ref([]) as Ref<Array<MessageType>>;
const usersOnline = ref([]) as Ref<Array<UserTypeInUsersArrayType>>;
const onDragClass = ref(false) as Ref<boolean>;
const isLoadingMessages = ref(false) as Ref<boolean>;

const store = useAuthStore();

if (!store.isAuth) {
  router.push("/login");
}

// onRenderTriggered(({ key, target, type }) =>
//   console.log({ key, target, type })
// ); // Тест производительности

const connection = new WebSocket(
  `${import.meta.env.VITE_APP_PROTOCOL}://${
    import.meta.env.VITE_APP_HOST
  }?userID=${store.id}`
);

connection.onclose = function (event) {
  store.toast("К сожалению соединение разорвано");
};

function sendMessage(message: string) {
  if (connection.readyState === 1 && message !== "") {
    connection.send(
      JSON.stringify({
        event: currentChatEvent.value,
        data: {
          message: message.trim(),
          id: store.id,
          roomId: privateRoomId.value,
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

  if (file.type !== "image/webp" && file.type !== "image/png") {
    store.toast(
      "К сожалению пока не поддерживаемый формат файлов (Доступны только изображения форматов png и webp)"
    );
    return;
  }

  if (file.size > 300 * 1024) {
    store.toast("Изображение слишком большое. Максимальный размер - 300 КБ.");
    return;
  }

  reader.onload = function (eventReader) {
    const arrayBuffer = eventReader.target?.result;
    if (connection.readyState === 1) {
      connection.send(
        JSON.stringify({
          event: currentChatEvent.value,
          data: {
            message: Array.from(new Uint8Array(arrayBuffer as ArrayBuffer)),
            id: store.id,
            roomId: privateRoomId.value,
          },
        })
      );
    }
  };
  reader.readAsArrayBuffer(file);
}

watch(
  [() => currentChatEvent.value, privateRoomId.value],
  () => (isLoadingMessages.value = false)
);

const memoMessages = computed(() => messages.value);

connection.onmessage = function (event) {
  const data = JSON.parse(event.data);

  if (data.openRoom) {
    privateRoomId.value = data.messages.roomId;
  }

  if (data.messages && data.messages.event !== currentChatEvent.value) {
    console.log("ВНУТРИ", data.messages.event);
    return;
  }

  if (
    data.messages &&
    data.messages.roomId &&
    data.messages.roomId !== privateRoomId.value
  ) {
    return;
  }

  if (!privateRoomId.value && data.messages && data.messages.roomId) {
    return;
  }

  if (data.lengthMessages === 0 || data.lengthMessages !== messagesLength) {
    messagesLength = data.lengthMessages;
    // console.log('ВНУТРИ МЕССЕНДЖЕЙ');
    // console.log('data.lengthMessages', data.lengthMessages);
    // console.log('messagesLength', messagesLength);
  }

  if (data.userToAddPrivat && data.userToAddPrivat !== userToAddPrivate.value) {
    userToAddPrivate.value = data.userToAddPrivat;
  }

  if (data.messages?.message && Array.isArray(data.messages.message)) {
    const bufferData = new Uint8Array(data.messages.message);
    const blobMessage = new Blob([bufferData]);
    data.messages.message = URL.createObjectURL(blobMessage);
  }

  if (typeof data.messages?.message === "string") {
    const base64Image = data.messages.userPhoto;
    const binaryData = Uint8Array.from(atob(base64Image), (c) =>
      c.charCodeAt(0)
    );
    const blobImage = new Blob([binaryData]);
    data.messages.userPhoto = URL.createObjectURL(blobImage);

    if (data.messages.roomId === privateRoomId.value) {
      messages.value.unshift(data.messages);
    }
  }

  if (data.clients) {
    usersOnline.value = data.clients;
  }

  if (
    (data.lengthMessages && messages.value.length === messagesLength) ||
    data.lengthMessages === 0
  ) {
    isLoadingMessages.value = true;
  }
};

function OnDragChatContainer(event: any) {
  event.preventDefault();
  if (!onDragClass.value) {
    onDragClass.value = true;
  }
}

function goToPublicChat() {
  privateRoomId.value = null;
  currentChatEvent.value = "message";
  messages.value = [];
  if (connection.readyState === 1) {
    connection.send(
      JSON.stringify({
        event: "all_messages_public",
        data: { id: store.id },
      })
    );
  }
}

function onScroll(event: any) {
  const container = event.target as HTMLElement; // Получаем контейнер, на который произошло событие скроллинга
  // Проверяем, достиг ли пользователь нижней границы контейнера
  if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
    // Достигнут конец страницы
  }
}

function openRoomHandler(id: string) {
  currentChatEvent.value = "private_message";
  messages.value = [];
  if (connection.readyState === 1) {
    connection.send(
      JSON.stringify({
        event: "open_room",
        data: { myId: store.id, userId: id },
      })
    );
  }
}

onUnmounted(() => {
  connection.close();
});
</script>

<style scoped lang="scss">
.v-mainPage {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 90vh;
  width: 100%;
  max-width: 1980px;
  margin: auto;
}

.v-mainPage__chatContainer {
  display: flex;
  flex-direction: column-reverse;
  padding: 20px;
  width: 75%;
  height: 650px;
  overflow-y: auto;
  background: #ffffff;
  -webkit-box-shadow: 0px 0px 80px -28px rgba(0, 0, 0, 0.16);
  -moz-box-shadow: 0px 0px 80px -28px rgba(2, 2, 2, 0.16);
  box-shadow: 0px 0px 80px -28px rgba(0, 0, 0, 0.16);
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
  cursor: pointer;
  background-color: #141416;
  transition: 0.5s;
  color: white;
  padding: 5px 10px;
  margin: 0;
  gap: 5px;

  &:hover {
    transition: 0.5s;
    border: 2px solid #000;
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
</style>
