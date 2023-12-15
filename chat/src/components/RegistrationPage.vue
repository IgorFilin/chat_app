<template>
  <Popup
    :inputs="inputsRegistration"
    title="Регистрация"
    @submit="onRegistration" />
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/auth_store.ts';
import Popup from '@/components/assetsComponent/Popup.vue';
import { RegisterUserType } from '@/types/typesApi';

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
</script>

<style scoped lang="scss"></style>
