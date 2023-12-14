<template>
  <Popup
    :inputs="inputsRegistration"
    title="Регистрация"
    @submit="onRegistration" />
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/auth_store.ts';
import { onUpdated, ref, watch } from 'vue';
import { RegisterUserType } from '@/api/typesApi';
import Popup from '@/components/assetsComponent/Popup.vue';

const inputsRegistration = [
  {
    labelText: 'Имя:',
    changeValue: 'name',
    id: 'name',
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
