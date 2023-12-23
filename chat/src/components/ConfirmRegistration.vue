<template>
  <Popup
    :inputs="inputConfirm"
    title="Подтверждение почты"
    buttonText="Подтвердить"
    @submit="sendKey" />
</template>

<script setup lang="ts">
import router from '@/router/router';
import { useAuthStore } from '@/store/auth_store';
import Popup from '@/components/assetsComponent/Popup.vue';
import { ref, watch } from 'vue';

const inputConfirm = [
  {
    labelText: 'Ваш код:',
    changeValue: 'code',
    id: 'text',
  },
];

const store = useAuthStore();

function sendKey(keyData: { code: string }) {
  store.confirmRegistration(keyData.code);
}

watch(
  () => store.isAuth,
  () => {
    if (store.isAuth) {
      router.push('/main');
    }
  }
);
</script>

<style scoped lang="scss"></style>
