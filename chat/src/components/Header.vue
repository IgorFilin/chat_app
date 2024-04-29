<template>
  <div class="v-header__container">
    <div
      class="v-header__burger"
      :class="{ active: appStore.isOpenBurger }"
      @click="appStore.toggleBurger"
    >
      <span
        class="v-header__itemBurger"
        v-for="_ in 3"
      ></span>
      <div
        v-if="appStore.isOpenBurger"
        class="v-header__buttonsBurger"
      >
        <Button
          v-for="({ variant, show, isChat }, index) in navigateButtons"
          :key="index"
          :text="getVariantButton(isChat, index).text"
          v-show="show"
          class="v-header__navigateButton"
          @onClick="goTo(getVariantButton(isChat, index).redirect)"
        />
      </div>
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
import { useAppStore } from '@/store/app_store.ts';
import { computed, onMounted, onUnmounted, onUpdated, ref, watch } from 'vue';
import Button from '@/components/assetsComponent/Button.vue';
import { useYandexStore } from '@/store/yandex_store.ts';
import Icon from '@/components/assetsComponent/Icon.vue';

const store = useAuthStore();
const yaStore = useYandexStore();
const appStore = useAppStore();
const track = ref();
const isOpenModal = ref(false);
const isOpenAudioTrack = ref(true);
const isOpenBurger = ref(false);

const navigateButtons = ref([
  // {
  //   text: 'Регистрация',
  //   redirect: '/registration',
  //   show: true,
  //   isActive: false,
  // },
  // {
  //   text: 'Вход',
  //   redirect: '/login',
  //   show: true,
  //   isActive: false,
  // },
  // {
  //   variantText: ['Подтвердить почту','В чат'],
  //   redirect: '/confirm',
  //   show: false,
  //   isActive: false,
  // },
  {
    variant: {
      chat: {
        text: 'В чат',
        redirect: '/main',
      },
      current: {
        text: 'Плеер',
        redirect: '/music',
      },
    },
    show: true,
    isChat: false,
  },
  {
    variant: {
      chat: {
        text: 'В чат',
        redirect: '/main',
      },
      current: {
        text: 'Игровые комнаты',
        redirect: '/gameRooms',
      },
    },
    show: true,
    isChat: false,
  },
]);

function goTo(route: string) {
  router.push(route);
}

// Какие кнопки в шапке показывать при прохождении авторизации, а как без
watch(
  [() => store.isAcceptKey, () => store.isAuth],
  () => {
    navigateButtons.value[0].show = store.isAuth;
    navigateButtons.value[1].show = store.isAuth;
  },
  { immediate: true }
);

// Изменение редиректа и текста кнопки в зависимости от урла
watch(
  () => store.currentPath,
  () => {
    navigateButtons.value.forEach((btn, index) => {
      console.log('for');
      btn.isChat = false;
    });
    switch (store.currentPath) {
      case '/music': {
        navigateButtons.value[0].isChat = true;
        break;
      }
      case '/gameRooms': {
        navigateButtons.value[1].isChat = true;
        break;
      }
      default: {
        navigateButtons.value.forEach((btn) => {
          btn.isChat = false;
        });
        break;
      }
    }

    // setActiveNavigationButton(store.currentPath);
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

// function setActiveNavigationButton(path: string) {
//   navigateButtons.value.forEach((button) => {
//     button.isActive = button.redirect === path;
//   });
// }

function getVariantButton(isChat: boolean, index: number) {
  const variantKey = isChat ? 'chat' : 'current';
  return navigateButtons.value[index].variant[variantKey];
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

.v-header__navigateButton {
  font-size: 15px;
  background-color: initial;
  border: none;
  cursor: pointer;
  align-self: center;
  padding: 0;
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

.v-header__burger {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  position: relative;
  height: 17px;
  cursor: pointer;

  .v-header__itemBurger {
    width: 100%;
    height: 3px;
    background-color: $orange;
    border-radius: 3px;
    transition: transform 0.3s ease;
  }

  .v-header__buttonsBurger {
    position: absolute;
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 5px;
    top: 40px;
    width: 150px;
    background-color: $cacaoBlack;
    left: -20px;
    transition: 0.4s;
    z-index: 9;

    .v-button {
      border: 2px solid $orange;
      width: 100%;
      padding: 5px;

      &:hover {
        transition: 0.4s;
        background: $darkBlack;
        color: white;
      }
    }
  }

  &.active {
    .v-header__itemBurger:nth-child(1) {
      transform: translateY(7px) rotate(45deg);
    }
    .v-header__itemBurger:nth-child(2) {
      opacity: 0;
    }
    .v-header__itemBurger:nth-child(3) {
      transform: translateY(-7px) rotate(-45deg);
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
