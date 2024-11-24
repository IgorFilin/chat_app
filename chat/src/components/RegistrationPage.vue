<template>
  <Popup
    :inputs="inputsRegistration"
    title="Регистрация"
    buttonText="Зарегистрироваться"
    @submit="onRegistration"
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
import { useAuthStore } from '@/store/auth_store.ts';
import { useAppStore } from '@/store/app_store.ts';
import Popup from '@/components/assetsComponent/Popup.vue';
import { RegisterUserType } from '@/types/typesApi';
import { computed, watchEffect } from 'vue';
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

const dataAdditional = computed(() => {
  return [
    {
      text: 'Уже есть аккаунт?',
      linkText: 'Войдите здесь',
      fn: onLoginLinkHandler,
      show: true,
    },
    {
      text: 'Так же вы можете',
      linkText: 'Подтвердить почту',
      fn: onConfirmLinkHandler,
      show: appStore.isAcceptKey,
    },
  ];
});

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
