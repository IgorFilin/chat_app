<template>
  <Popup
    :inputs="inputConfirm"
    title="Подтверждение почты"
    buttonText="Подтвердить"
    @submit="sendKey">
    <template #additional>
      <div v-if="isDisabledSecondSend">Следующая отправка через: {{ counter }}</div>
      <div :class="['sendButton', isDisabledSecondSend && 'disabled']">Повторить отправку</div>
    </template>
  </Popup>
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

const isDisabledSecondSend = ref(true);
const counter = ref(20);
let intervalId: any;

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

watch(
  () => isDisabledSecondSend.value,
  () => {
    if (isDisabledSecondSend.value) {
      intervalId = setInterval(() => {
        counter.value--;
        if (counter.value === 0) {
          isDisabledSecondSend.value = false;
        }
      }, 1000);
    } else {
      clearInterval(intervalId);
    }
  },
  { immediate: true }
);
</script>

<style scoped lang="scss"></style>
