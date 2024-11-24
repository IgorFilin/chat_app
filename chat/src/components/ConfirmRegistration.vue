<template>
  <Popup
    :inputs="inputConfirm"
    title="Подтверждение почты"
    buttonText="Подтвердить"
    @submit="sendKey"
  >
    <template #additional>
      <div v-if="isDisabledSecondSend">Следующая отправка через: {{ counter }}</div>
      <Button
        text="Повторить отправку"
        @onClick="repeatedSendMail"
        :isDisabled="isDisabledSecondSend"
        :class="['v-confirmRegistration__repeatSendBtn']"
        class="empty"
      />
    </template>
  </Popup>
</template>

<script setup lang="ts">
import router from '@/router/router';
import { useAuthStore } from '@/store/auth_store';
import Popup from '@/components/assetsComponent/Popup.vue';
import Button from './assetsComponent/Button.vue';
import { Ref, ref, watch } from 'vue';

const inputConfirm = [
  {
    labelText: 'Ваш код:',
    changeValue: 'code',
    id: 'text',
  },
];

const store = useAuthStore();
const isDisabledSecondSend = ref(true);
const counter = ref(0) as Ref<number>;
const acceptKeyRepeatSend = ref(store.email || localStorage.getItem('email')!) as any;
let intervalId: any;

function sendKey(keyData: { code: string }) {
  store.confirmRegistration(keyData.code);
}

async function repeatedSendMail() {
  store.confirmSendMailMessage(acceptKeyRepeatSend.value);
  isDisabledSecondSend.value = true;
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
      counter.value = 20;
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
<style lang="scss">
.v-confirmRegistration__repeatSendBtn {
  font-size: 16px;
}
</style>
