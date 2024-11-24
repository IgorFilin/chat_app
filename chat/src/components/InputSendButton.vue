<template>
  <div class="v-inputSendButton">
    <textarea
      @keyup.enter="sendMessage"
      @input="onChangeTextarea"
      v-model="message"
      class="v-inputSendButton__Input"
      type="text"
      maxlength="600"
    />
    <label
      class="v-inputSendButton__iconCloseContainer"
      for="addFile"
    >
      <Icon
        class="v-inputSendButton__iconClose"
        id="add-file"
        color="orange"
      />
      <input
        type="file"
        @change="(e) => $emit('sendFile', e)"
        hidden
        accept="image/png,image/webp,image/jpeg"
        id="addFile"
      />
    </label>
    <Button
      @onClick="sendMessage"
      text="Отправить сообщение"
      class="v-inputSendButton_chatButton"
    />
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, watch } from 'vue';
import Button from './assetsComponent/Button.vue';
import Icon from '@/components/assetsComponent/Icon.vue';

const emit = defineEmits();

const message = ref('') as Ref<string>;
const idTimeout = ref(null) as Ref<string | null>;
const isTyping = ref(false);

function sendMessage() {
  emit('sendMessage', message.value);
  message.value = '';
}

// причины флажка "Я печатаю":
// -- человек печатает текст, срабатывает метод input
// причины остановки:
// -- человек остановился, перестал печатать, тоесть не меняется message.length или не срабатывает
// метод change. Желательно сделать с таймаутов в секунду остановку.
// -- человек отправил сообщения, или очистил поле опять же длинна message.length

watch(
  () => message.value,
  (newValue, oldValue) => {
    if (!newValue) {
      isTyping.value = false;
      return;
    }
    if (oldValue !== newValue) {
      clearTimeout(idTimeout.value);
      isTyping.value = true;
    }
    idTimeout.value = setTimeout(() => {
      isTyping.value = false;
    }, 2000);
  }
);

watch(
  () => isTyping.value,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      emit('isTyping', isTyping.value);
    }
  }
);
</script>

<style lang="scss">
.v-inputSendButton {
  grid-area: buttons;
  justify-self: center;
  display: flex;
  width: 100%;
  margin-top: 5px;
  max-width: 1400px;
}

.v-inputSendButton__Input {
  width: 100%;
  background-color: #053972;
  padding-left: 10px;
  border: 0;
  display: inline-block;
  vertical-align: middle;
  resize: none;
  padding: 10px;

  &:focus-visible {
    outline: none;
  }
}

.v-inputSendButton_chatButton {
  display: flex;
  padding: 5px 10px;
  background-color: $blackBlue;
  transition: 0.3s;
  border: none;

  &:hover {
    cursor: pointer;
    border: none;
    background: $cacaoBlack;
    color: white;
  }
}

.v-inputSendButton__iconClose {
  width: 35px;
  height: 35px;
}

.v-inputSendButton__iconCloseContainer {
  width: 80px;
  height: 100%;
  justify-content: center;
  display: flex;
  align-items: center;
  background: $cacaoBlack;
  transition: 0.5s;

  &:hover {
    cursor: pointer;
    transition: 0.5s;
    background: $blackBlue;
  }
}
</style>
