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
        class="v-header__modalItem"
        @click="onExitAccount"
      >
        Выход
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
    :class="{ hidden: isOpenAudioTrack }"
    v-if="yaStore.playedTrack.file"
    :key="yaStore.playedTrack.file"
  >
    <div
      class="v-header__clickOpenAudio"
      :class="[{ notActive: isOpenAudioTrack }, { played: yaStore.isPlayed && isOpenAudioTrack }]"
      @click="isOpenAudioTrack = !isOpenAudioTrack"
    ></div>
    <div
      :title="yaStore.playedTrack.name"
      class="v-header__audioName"
    >
      {{ yaStore.playedTrack.name }}
    </div>
    <audio
      class="v-header__audio"
      ref="track"
      controls
      autoplay
      @play="(e) => onChangePlayedHandler(e, true)"
      @pause="(e) => onChangePlayedHandler(e, false)"
    >
      <source
        :src="yaStore.playedTrack.file"
        type="audio/mpeg"
      />
      Ваш браузер не поддерживает аудиоэлемент.
    </audio>
    <div class="v-header__iconsContainer">
      <Icon
        v-for="key in 2"
        id="arrow"
        @click="onClickPrevNextTrackHandler(key === 1 ? 'prev' : 'next')"
        class="v-header__iconNextPrev"
        color="cacao"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import router from '@/router/router';
import { useAuthStore } from '@/store/auth_store';
import { onMounted, onUnmounted, onUpdated, ref, watch } from 'vue';
import Button from '@/components/assetsComponent/Button.vue';
import { useYandexStore } from '@/store/yandex_store.ts';
import Icon from '@/components/assetsComponent/Icon.vue';

const store = useAuthStore();
const yaStore = useYandexStore();
const track = ref();
const isOpenModal = ref(false);
const isOpenAudioTrack = ref(true);

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

// Какие кнопки в шапке показывать при прохождении авторизации, а как без
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

// Изменение редиректа и текста кнопки в зависимости от урла
watch(
  () => store.currentPath,
  () => {
    switch (store.currentPath) {
      case '/gameRooms': {
        navigateButtons.value[3].text = 'В чат';
        navigateButtons.value[3].redirect = '/main';
        break;
      }
      case '/music': {
        navigateButtons.value[4].text = 'В чат';
        navigateButtons.value[4].redirect = '/main';
        break;
      }
      default: {
        navigateButtons.value[3].text = 'Игровые комнаты';
        navigateButtons.value[3].redirect = '/gameRooms';

        navigateButtons.value[4].text = 'Музыка';
        navigateButtons.value[4].redirect = '/music';
        break;
      }
    }

    setActiveNavigationButton(store.currentPath);
  },
  { immediate: true }
);

watch(
  () => yaStore.isPlayed,
  (newValue, oldValue) => {
    if (track.value) {
      if (!newValue) track.value.pause();
      else track.value.play();
    }
  }
);

watch(
  () => track.value,
  () => {
    if (track.value) {
      track.value.volume = 0.1;
    }
  }
);

async function onExitAccount() {
  if (store.isAuth) {
    await store.logout();
    isOpenModal.value = false;
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
  yaStore.setIsPlay(isPlayed);
}

function onClickPrevNextTrackHandler(value: string) {
  yaStore.setNextPrevTrack(value);
}
onUpdated(() => {
  if (yaStore.isPlayed) {
    setTimeout(function () {
      track.value.play();
    }, 150);
  }
});
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

.v-header__audioName {
  margin-bottom: 5px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  max-width: 300px;
  overflow: hidden;
}

.v-header__iconsContainer {
  display: flex;
  background: $skyBlue;
  justify-content: space-between;
  top: -4px;

  .v-header__iconNextPrev {
    box-sizing: border-box;
    width: 150px;
    height: 20px;
    transition: 0.5s;

    &:first-child {
      border-left: 2px solid $cacaoBlack;
      transform: rotate(180deg);
    }

    &:hover {
      cursor: pointer;
      background: $darkBlue;
      transition: 0.5s;

      &.v-icon {
        color: white;
      }
    }
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
  position: relative;
  z-index: 999999;

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
  right: 20px;
  transition: 0.5s;
  z-index: 9;

  &.hidden {
    transition: 0.5s;
    right: -300px;
  }
}

.v-header__userName {
  align-self: center;
  cursor: pointer;
  font-size: 20px;
}

.v-header__clickOpenAudio {
  content: '';
  display: block;
  height: 39px;
  width: 39px;
  border: inherit;
  position: absolute;
  clip-path: polygon(0% 0%, 100% 100%, 0% 100%);
  transform: rotate(45deg);
  z-index: 99;
  background: $blue;
  right: 280px;
  top: 30.5%;
  border-radius: 0 0 0 0.25em;
  transition: 0.5s;
  cursor: pointer;
  background: $skyBlue;

  &.notActive {
    background: $orange;
  }

  &.played {
    position: absolute;
    animation: pulse 0.6s alternate infinite;
  }

  @keyframes pulse {
    0% {
      transform: rotate(45deg) scale(1);
      background-color: $orange;
    }
    100% {
      transform: rotate(45deg) scale(1.05);
      background-color: $skyBlue;
    }
  }
}

.v-header__modalWindow {
  position: absolute;
  text-align: center;
  top: 60px;
  right: 30px;
  max-width: 150px;
  width: 100%;
  background: $blue;
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
