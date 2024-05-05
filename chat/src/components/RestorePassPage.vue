<template>
  <Popup
    v-for="popup in popups"
    v-show="popup.mode === mode"
    :key="popup.mode"
    class="v-restorePassPage"
    :inputs="popup.input"
    isCloseBtn
    :disabledSubmit="isDisabledSecondSend"
    title="Сброс пароля"
    buttonText="Отправить"
    @onClose="onCloseHandler"
    @submit="(submitData) => onSubmitHandler(submitData, mode)"
  >
    <template #additional>
      <div v-if="isDisabledSecondSend">Следующая отправка через: {{ counter }}</div>
      <div class="v-restorePassPage__additional">{{ popup.textAdditional }}</div>
      <Button
        :text="popup.textAdditionalButton"
        @onClick.prevent.stop="mode === 'send' ? (mode = 'confirm') : (mode = 'send')"
        :isDisabled="isDisabledSecondSend"
        class="empty v-restorePassPage__repeatSendBtn"
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

const popups = [
  {
    mode: 'send',
    input: [
      {
        labelText: 'Введите вашу почту:',
        changeValue: 'email',
        id: 'email',
      },
    ],
    textAdditional: 'Вам на почту придёт ключ, который далее потребуется ввести',
    textAdditionalButton: 'Ввести ключ',
  },
  {
    mode: 'confirm',
    input: [
      {
        labelText: 'Введите ключ:',
        changeValue: 'key',
        id: 'text',
      },
      {
        labelText: 'Введите новый пароль:',
        changeValue: 'password',
        id: 'text',
      },
    ],
    textAdditional: 'Ключ получен на Вашу почту',
    textAdditionalButton: 'Повторно ввести почту',
  },
];

const isDisabledSecondSend = ref(false);
const mode = ref('send');
const counter = ref(0) as Ref<number>;

let intervalId: any;
const store = useAuthStore();

function onSubmitHandler(submitData: any, mode: string) {
  isDisabledSecondSend.value = true;
  switch (mode) {
    case 'send': {
      store.confirmSendMailMessage(submitData.email, 'pass');
      break;
    }
    case 'confirm': {
      store.confirmKeyRestorePass(submitData);
      break;
    }
  }
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

.v-restorePassPage__repeatSendBtn {
  color: $skyBlue;
}
</style>
