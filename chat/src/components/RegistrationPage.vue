<template>
  <Popup
    :inputs="inputsRegistration"
    title="Регистрация"
    buttonText="Зарегистрироваться"
    @submit="onRegistration"
  >
    <template #additional>
      <div class="v-popup__LinkContainer">
        Уже есть аккаунт?
        <span
          class="v-popup__Link"
          @click="onLoginLinkHandler"
        >
          Войдите здесь
        </span>
      </div>
      <div
        class="v-popup__LinkContainer"
        v-if="appStore.isAcceptKey"
      >
        Так же вы можете
        <span
          class="v-popup__Link"
          @click="onConfirmLinkHandler"
        >
          Подтвердить почту
        </span>
      </div>
    </template>
  </Popup>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/auth_store.ts';
import { useAppStore } from '@/store/app_store.ts';
import Popup from '@/components/assetsComponent/Popup.vue';
import { RegisterUserType } from '@/types/typesApi';
import { watchEffect } from 'vue';
import router from '@/router/router';

const appStore = useAppStore();

const inputsRegistration = [
  {
    labelText: 'Имя:',
    changeValue: 'name',
    id: 'text',
  },
  {
    labelText: 'Почта:',
    changeValue: 'email',
    id: 'email',
  },
  {
    labelText: 'Пароль:',
    changeValue: 'password',
    id: 'password',
  },
];

const store = useAuthStore();

function onRegistration(data: RegisterUserType) {
  store.registration(data);
}

function onConfirmLinkHandler() {
  router.push('/confirm');
}

function onLoginLinkHandler() {
  router.push('/login');
}

watchEffect(() => {
  if (store.isAuth) router.push('/main');
});
</script>

<style scoped lang="scss"></style>
