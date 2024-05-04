<template>
  <Popup
    class="v-restorePassPage"
    :inputs="inputRestore"
    isCloseBtn
    :disabledSubmit="isDisabledSecondSend"
    title="Восстановление пароля"
    buttonText="Отправить"
    @onClose="onCloseHandler"
    @submit="onSubmitHandler"
  >
    <template #additional>
      <div v-if="isDisabledSecondSend">Следующая отправка через: {{ counter }}</div>
      <div class="v-restorePassPage__additional">Вам на почту придёт ключ, который далее потребуется ввести</div>
    </template>
  </Popup>
</template>

<script setup lang="ts">
import router from '@/router/router';
import { useAuthStore } from '@/store/auth_store';
import Popup from '@/components/assetsComponent/Popup.vue';
import Button from './assetsComponent/Button.vue';
import { Ref, ref, watch } from 'vue';

const inputRestore = [
  {
    labelText: 'Введите вашу почту:',
    changeValue: 'email',
    id: 'email',
  },
];
const isDisabledSecondSend = ref(false);
const counter = ref(0) as Ref<number>;
let intervalId: any;

const store = useAuthStore();

function onSubmitHandler(submitData: any) {
  isDisabledSecondSend.value = true;
  store.confirmSendMailMessage(submitData.email, 'pass');
}

function onCloseHandler() {
  router.push('/');
}

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
.v-restorePassPage {
  .v-popup__title {
    font-size: 20px;
  }
}

.v-restorePassPage__additional {
  text-align: center;
  width: 80%;
}
</style>
