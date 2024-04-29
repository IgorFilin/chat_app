<template>
  <Popup
    :inputs="inputsLogin"
    title="Вход"
    buttonText="Войти"
    @submit="onLogin"
  >
    <template #additional>
      <div class="v-popup__LinkContainer">
        Ещё нет аккаунта?
        <span
          class="v-popup__Link"
          @click="onRegistrationLinkHandler"
        >
          Начните здесь
        </span>
      </div>
      <div
        class="v-popup__LinkContainer"
        v-if="appStore.isAcceptKey"
      >
        Так же вы можете
        <span
          v-if="appStore.isAcceptKey"
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
import { ref, watch, watchEffect } from 'vue';
import { useAuthStore } from '@/store/auth_store.ts';
import Popup from '@/components/assetsComponent/Popup.vue';
import router from '@/router/router';
import { LoginUserType } from '@/types/typesApi';
import { useAppStore } from '@/store/app_store.ts';

const appStore = useAppStore();

const inputsLogin = [
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

function onLogin(data: LoginUserType) {
  store.loginAction(data);
}

function onConfirmLinkHandler() {
  router.push('/confirm');
}

function onRegistrationLinkHandler() {
  router.push('/registration');
}

watchEffect(() => {
  if (store.isAuth) router.push('/main');
});
</script>

<style scoped lang="scss"></style>
