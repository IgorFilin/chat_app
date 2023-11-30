<template>
  <div class="v-header__container">
    <div class="v-header__buttonsContainer">
      <button
        v-if="!store.isAuth"
        class="v-header__navigateButton"
        @click="goTo('/registration')">
        Регистрация
      </button>
      <button
        v-if="!store.isAuth"
        class="v-header__navigateButton"
        @click="goTo('/login')">
        Вход
      </button>
      <button
        v-if="store.isAcceptKey === false"
        class="v-header__navigateButton"
        @click="goTo('/confirm')">
        Подтвердить почту
      </button>
    </div>
    <div class="v-header__nameLogoutContainer">
      <label for="download">
        <div v-if="store.isAuth">
          <img
            class="v-header__photoUser"
            :src="store.userPhoto"
            :key="store.userPhoto"
            alt="Аватар" />
          <input
            id="download"
            @change="downloadPhoto"
            hidden
            type="file"
            accept="image/webp,image/png" />
        </div>
      </label>
      <div
        class="v-header__userName"
        v-if="store.name">
        {{ store.name }}
      </div>
      <button
        v-if="store.isAuth"
        class="v-header__navigateButton"
        @click="onExitAccount">
        Выход
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from '@/router/router';
import { useAuthStore } from '@/store/auth_store';
import { watch } from 'vue';

const store = useAuthStore();

function goTo(route: string) {
  router.push(route);
}

watch(
  () => store.isAcceptKey,
  () => {
    console.log('acceptKey', store.isAcceptKey);
  },
  { immediate: true }
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
</script>

<style scoped lang="scss">
.v-header__container {
  background-color: #000000;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.v-header__buttonsContainer {
  display: flex;
  gap: 15px;
}

.v-header__navigateButton {
  background-color: initial;
  color: white;
  border: none;
  cursor: pointer;
  align-self: center;
}

.v-header__nameLogoutContainer {
  display: flex;
  gap: 20px;
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
.v-header__userName {
  text-decoration: underline;
  align-self: center;
}
</style>
