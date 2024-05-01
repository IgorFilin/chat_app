<template>
  <Popup
    :inputs="inputsLogin"
    title="Вход"
    buttonText="Войти"
    @submit="onLogin"
  >
    <template #additional>
      <div
        v-show="show"
        v-for="{ text, show, linkText, fn } in dataAdditional"
        class="v-popup__LinkContainer"
      >
        {{ text }}
        <span
          class="v-popup__Link"
          @click="fn"
        >
          {{ linkText }}
        </span>
      </div>
    </template>
  </Popup>
</template>

<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue';
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

const dataAdditional = computed(() => {
  return [
    {
      text: 'Ещё нет аккаунта?',
      linkText: 'Начните здесь',
      fn: onRegistrationLinkHandler,
      show: true,
    },
    {
      text: 'Так же вы можете',
      linkText: 'Подтвердить почту',
      fn: onConfirmLinkHandler,
      show: appStore.isAcceptKey,
    },
    {
      text: 'Забыли пароль?',
      linkText: 'Восстановить',
      fn: onRestorePassword,
      show: true,
    },
  ];
});

const store = useAuthStore();

function onLogin(data: LoginUserType) {
  store.loginAction(data);
}

function onConfirmLinkHandler() {
  router.push('/confirm');
}

function onRestorePassword() {
  router.push('/restore');
}

function onRegistrationLinkHandler() {
  router.push('/registration');
}

watchEffect(() => {
  if (store.isAuth) router.push('/main');
});
</script>

<style scoped lang="scss"></style>
