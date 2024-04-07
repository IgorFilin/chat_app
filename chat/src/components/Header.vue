<template>
  <div class="v-header__container">
    <div class="v-header__buttonsContainer">
      <Button
        v-for="({ text, redirect, show, isActive }, index) in navigateButtons"
        :class="{ active: isActive }"
        :text="text"
        v-show="show"
        class="v-header__navigateButton"
        @onClick="goTo(redirect)"
      />
    </div>
    <div class="v-header__nameLogoutContainer">
      <label for="download">
        <div v-if="store.isAuth">
          <img
            class="v-header__photoUser"
            :src="store.userPhoto"
            :key="store.userPhoto"
            alt="Аватар"
          />
          <input
            id="download"
            @change="downloadPhoto"
            hidden
            type="file"
            accept="image/webp,image/png"
          />
        </div>
      </label>
      <div
        class="v-header__userName"
        @click="isOpenModal = !isOpenModal"
        v-if="store.name"
      >
        {{ store.name }}
      </div>
      <button
        v-if="store.isAuth"
        class="v-header__navigateButton"
        @click="onExitAccount"
      >
        Выход
      </button>
    </div>
  </div>
  <transition
    name="fade"
    mode="out-in"
  >
    <div
      class="v-header__modalWindow"
      v-if="isOpenModal"
    >
      <div
        class="v-header__modalItem"
        @click="goTo(`/profile/${store.id}/`), (isOpenModal = false)"
      >
        Профиль
      </div>
      <div
        class="v-header__modalItem close"
        @click="isOpenModal = false"
      >
        Закрыть
      </div>
    </div>
  </transition>
  <div
    class="v-header__musicPlayer"
    v-if="yaStore.playedTrack !== null"
    :key="yaStore.playedTrack"
  >
    {{ yaStore.isPlayed }}
    <audio
      class="v-header__audio"
      ref="track"
      controls
      @play="(e) => onChangePlayedHandler(e, true)"
      @pause="(e) => onChangePlayedHandler(e, false)"
      autoplay
    >
      <source
        :src="yaStore.playedTrack"
        type="audio/mpeg"
      />
      Ваш браузер не поддерживает аудиоэлемент.
    </audio>
  </div>
</template>

<script setup lang="ts">
import router from '@/router/router';
import { useAuthStore } from '@/store/auth_store';
import { ref, watch } from 'vue';
import Button from '@/components/assetsComponent/Button.vue';
import { useYandexStore } from '@/store/yandex_store.ts';

const store = useAuthStore();
const yaStore = useYandexStore();

const track = ref();

const isOpenModal = ref(false);

const navigateButtons = ref([
  {
    text: 'Регистрация',
    redirect: '/registration',
    show: true,
    isActive: false,
  },
  {
    text: 'Вход',
    redirect: '/login',
    show: true,
    isActive: false,
  },
  {
    text: 'Подтвердить почту',
    redirect: '/confirm',
    show: false,
    isActive: false,
  },
  {
    text: '',
    redirect: ``,
    show: true,
    isActive: false,
  },
  {
    text: 'Музыка',
    redirect: '/music',
    show: true,
    isActive: false,
  },
]);

function goTo(route: string) {
  router.push(route);
}

watch(
  [() => store.isAcceptKey, () => store.isAuth],
  () => {
    navigateButtons.value[0].show = !store.isAuth;
    navigateButtons.value[1].show = !store.isAuth;
    navigateButtons.value[2].show = store.isAcceptKey === false;
    navigateButtons.value[3].show = store.isAuth;
    navigateButtons.value[4].show = store.isAuth;
  },
  { immediate: true }
);

watch(
  () => store.currentPath,
  () => {
    if (store.currentPath === '/gameRooms') {
      navigateButtons.value[3].text = 'В чат';
      navigateButtons.value[3].redirect = '/main';
    } else {
      navigateButtons.value[3].text = 'Игровые комнаты';
      navigateButtons.value[3].redirect = '/gameRooms';
    }
    setActiveNavigationButton(store.currentPath);
  },
  { immediate: true }
);

watch(
  () => yaStore.isPlayed,
  (newValue, oldValue) => {
    if (track.value) {
      if (!newValue) {
        track.value.pause();
      }
    }
  }
);

async function onExitAccount() {
  if (store.isAuth) {
    await store.logout();
    router.push('/login');
  }
}

function downloadPhoto(event: any) {
  const file = event.target.files[0];
  store.sendAvatarUser(file);
}

function setActiveNavigationButton(path: string) {
  navigateButtons.value.forEach((button) => {
    button.isActive = button.redirect === path;
  });
}

function onChangePlayedHandler(e: any, isPlayed: boolean) {
  console.log('change', e);
  yaStore.setIsPlay(isPlayed);
}
</script>

<style scoped lang="scss">
.v-header__container {
  background-color: $black;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  position: relative;
}

.v-header__buttonsContainer {
  display: flex;
  gap: 15px;
}

.v-header__navigateButton {
  font-size: 15px;
  background-color: initial;
  border: none;
  cursor: pointer;
  align-self: center;
  padding: 0;

  &.active {
    color: #e2e5e8;
  }
}

.v-header__nameLogoutContainer {
  display: flex;
  gap: 25px;
  align-self: center;
}

.v-header__photoUser {
  width: 40px;
  height: 40px;
  transition: 0.5s;
  border-radius: 50%;
  object-fit: cover;

  &:hover {
    transition: 0.5s;
    cursor: pointer;
    opacity: 0.8;
  }
}

.v-header__audio {
  &::-webkit-media-controls-panel {
    background-color: $skyBlue;
    border-radius: 0;
    outline: none;
  }

  &::-webkit-media-controls-play-button {
    color: $darkBlue;
  }

  &::-webkit-media-controls-enclosure {
    border-radius: 0;
  }

  &::-webkit-media-controls-current-time-display {
    color: $darkBlue;
  }

  &::-webkit-media-controls-time-remaining-display {
    color: $darkBlue;
  }

  &::-webkit-media-controls-volume-slider {
    color: $darkBlue;
  }
}

.v-header__musicPlayer {
  position: absolute;
  bottom: 20px;
  right: 20px;
}

.v-header__userName {
  align-self: center;
  cursor: pointer;
  font-size: 20px;
}

.v-header__modalWindow {
  position: absolute;
  text-align: center;
  top: 60px;
  right: 30px;
  max-width: 150px;
  width: 100%;
  background: $blue;

  &::after {
    top: -39px;
    transform: translateX(-50%);
    position: absolute;
    content: '';
    border: 20px solid transparent;
    border-bottom: 20px solid $orange;
  }
}

.v-header__modalItem {
  border: 2px solid $orange;
  cursor: pointer;
  padding: 5px;

  &.close {
    background: $orange;
    color: $black;
  }
}
</style>
