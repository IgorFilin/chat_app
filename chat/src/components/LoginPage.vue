<template>
  <Popup
    :inputs="inputsLogin"
    title="Вход"
    buttonText="Войти"
    @submit="onLogin" />
</template>

<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue';
import { useAuthStore } from '@/store/auth_store.ts';
import Popup from '@/components/assetsComponent/Popup.vue';
import router from '@/router/router';
import { LoginUserType } from '@/types/typesApi';

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

async function onLogin(data: LoginUserType) {
  store.loginAction(data);
}

watchEffect(() => {
  if (store.isAuth) router.push('/main');
});
</script>

<style scoped lang="scss"></style>
