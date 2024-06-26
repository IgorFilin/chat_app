div
<template>
  <div
    class="v-usersOnline"
    :class="{ active: isActiveUserContainer }"
    @click="showPopup = false"
  >
    <div
      class="v-usersOnline__clickElem"
      v-if="false"
      :class="{ notActive: !isActiveUserContainer }"
      @click="onActiveUserContainer"
    />
    <input
      class="v-usersOnline__search"
      type="search"
      placeholder="Поиск"
      v-model="searchedUser"
    />
    <div class="v-usersOnline__allChatButtonContainer">
      <Button
        v-if="!socketStore.isAllChat"
        @onClick="goToPublicChat"
        text="В общий чат"
        class="v-usersOnline__goToAllChatButton"
        isIcon
        iconId="arrow_back"
        iconColor="white"
      />
    </div>
    <div class="v-usersOnline__usersContainer">
      <div
        class="v-usersOnline__user"
        :class="{ online: user.online, isOpenPopup: clikedUser.id === user.id, hover: user.online && !showPopup }"
        @click.right="(event) => clickedUserHandler(event, user)"
        @click.left="(event) => onPrivateRoomHandler(event, user.id)"
        v-for="user in filteredActiveOrNotUsers"
        :key="user.id"
      >
        <img
          class="v-usersOnline__photoUser"
          :src="user.userPhoto"
          :key="`user.userPhoto${user.id}`"
          alt="Аватар"
        />
        <div>{{ user.name }}</div>
        <UserOnlineContainerSelect
          :isOpen="showPopup && clikedUser.id === user.id"
          :selectData="selectData"
          @goTo="goTo(`/profile/${user.id}/`)"
          @sendInviteGame="(game) => sendInviteGameHandler(user.id, game)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, Ref, onUpdated } from 'vue';
import UserOnlineContainerSelect from '@/components/UserOnlineContainer/UserOnlineContainerSelect.vue';
import { useUserStore } from '@/store/user_store.ts';
import { useAuthStore } from '@/store/auth_store.ts';
import Button from '@/components/assetsComponent/Button.vue';
import router from '@/router/router';
import { useAppStore } from '@/store/app_store.ts';
import { useSocketStore } from '@/store/socket_store.ts';

const socketStore = useSocketStore();

const emit = defineEmits(['sendInviteGame', 'openRoom', 'isActiveContainer']);

const user_store = useUserStore();
const auth_store = useAuthStore();
const appStore = useAppStore();

const searchedUser = ref('') as Ref<string>;
const isActiveUserContainer = ref(false) as Ref<boolean>;
const users = ref([]) as Ref<Array<UserTypeInUsersArrayType>>;
const showPopup = ref(false) as Ref<boolean>;
const clikedUser = ref({
  name: '',
  id: '',
}) as Ref<UserType>;

const selectData = [
  {
    text: 'Профиль',
    emitName: 'goTo',
  },
  {
    text: 'Играть',
    additionalList: [{ text: 'Кр.Нолики', type: 'ticTacToe' }],
    action: 'isOpenAdditionalList',
  },
];

const props = defineProps({
  usersOnline: {
    type: Array<UserTypeInUsersArrayType>,
    desc: 'Массив онлайн пользователей',
    default() {
      return [];
    },
  },
});

function goTo(route: string) {
  router.push(route);
}

function onActiveUserContainer() {
  appStore.isOpenBurger = false;
  isActiveUserContainer.value = !isActiveUserContainer.value;
  emit('isActiveContainer', isActiveUserContainer.value);
}

function clickedUserHandler(event: MouseEvent, user: UserType) {
  event.preventDefault();
  event.stopPropagation();
  clikedUser.value = user;
  showPopup.value = true;
}

function onPrivateRoomHandler(event: MouseEvent, id: string) {
  event.stopPropagation();
  showPopup.value = false;
  emit('openRoom', id);
  isActiveUserContainer.value = false;
}

function sendInviteGameHandler(userId: string, game: string) {
  if (props.usersOnline.some((user) => user.id === userId)) {
    emit('sendInviteGame', userId, game);
    auth_store.toast('Приглашение отправлено');
  } else {
    auth_store.toast('К сожалению пользователя нет онлайн');
  }
}

function goToPublicChat() {
  socketStore.isAllChat = true;
  socketStore.roomId = null;
  socketStore.messages = [];
  socketStore.socket.emit('getAllMessages', {
    event: 'all_messages_public',
    data: { id: auth_store.id },
  });
}

watch(
  () => appStore.isOpenBurger,
  () => {
    if (appStore.isOpenBurger) {
      isActiveUserContainer.value = false;
    }
  }
);

onMounted(() => {
  user_store.getAllUsers();
});

watch(
  [() => props.usersOnline, () => user_store.users],
  () => {
    if (props.usersOnline) {
      users.value = user_store.users
        .map((user: UserType) => {
          if (props.usersOnline.some((userOnline: UserTypeInUsersArrayType) => userOnline.id === user.id)) {
            return {
              online: true,
              name: user.name,
              id: user.id,
              userPhoto: user.userPhoto,
            };
          } else {
            return user;
          }
        })
        .sort((a: any, b: any) => (a.online && !b.online ? -1 : 1));
    }
  },
  { immediate: true }
);

const filteredActiveOrNotUsers = computed(() => {
  const seachValue = searchedUser.value.toLowerCase().trim();
  if (!seachValue) {
    return users.value;
  }
  return users.value.filter((user: UserType) => user.name.toLowerCase().trim().includes(seachValue));
});
</script>

<style lang="scss">
.v-usersOnline {
  grid-area: users;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 20px 0 20px 20px;
  // max-width: 250px;
  // height: 100%;
  background-color: #1e1c1c;
  transition: 0.5s;
  z-index: 1;
  // grid-row: span 2;
  // top: 40px;

  &.active {
    left: -20px;
  }

  .v-usersOnline__search {
    background-color: #053972;
    border: 1px solid #141416;
    resize: none;
    border-radius: 15px;
    padding: 8px;
    margin-bottom: 10px;
    max-width: 200px;
    width: 100%;
    // height: 25px;

    &:focus-visible {
      outline: none;
    }

    &:focus {
      border: 1px solid $orange;
    }
  }

  .v-usersOnline__photoUser {
    width: 35px;
    height: 35px;
    transition: 0.5s;
    border-radius: 50%;
    object-fit: cover;
  }

  .v-usersOnline__user {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 17px;
    line-height: 20px;
    color: rgb(222, 212, 212);
    opacity: 0.3;
    cursor: pointer;
    width: 60%;

    &.online {
      color: rgb(25, 139, 25);
      opacity: 1;
    }

    &.hover {
      &:hover {
        transition: 0.5s;
        cursor: pointer;
        opacity: 0.8;
      }
    }
  }

  .v-usersOnline__allChatButtonContainer {
    height: 35px;
  }

  .v-usersOnline__goToAllChatButton {
    width: 200px;
    height: 35px;
  }

  .v-usersOnline__usersContainer {
    position: relative;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    gap: 15px;
    height: 90%;
    padding-top: 15px;

    &::-webkit-scrollbar {
      display: none;
      -ms-overflow-style: none; /* IE и Edge */
      scrollbar-width: none;
    }
  }

  .v-usersOnline__clickElem {
    content: '';
    display: block;
    height: 30px;
    width: 30px;
    border: inherit;
    position: absolute;
    clip-path: polygon(0% 0%, 100% 100%, 0% 100%);
    transform: rotate(225deg);
    z-index: 99;
    background: $cacaoBlack;
    right: -14px;
    top: 50%;
    border-radius: 0 0 0 0.25em;
    transition: 0.5s;
    cursor: pointer;

    &.notActive {
      background: $orange;
    }

    &.pulse {
      @keyframes pulse {
        0% {
          transform: rotate(225deg) scale(1);
          opacity: 0.5;
        }
        50% {
          transform: rotate(225deg) scale(1.2);
          opacity: 1;
        }
        100% {
          transform: rotate(225deg) scale(1);
          opacity: 0.5;
        }
      }
      animation: pulse 1.5s ease infinite;
    }

    @include phones {
      width: 50px;
      height: 50px;
      right: -24px;
    }
  }

  .isOpenPopup {
    position: relative;
  }
}
</style>
