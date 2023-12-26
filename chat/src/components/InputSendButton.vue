<template>
  <div class="v-inputSendButton">
    <textarea
      @keyup.enter="sendMessage"
      v-model="message"
      class="v-inputSendButton__Input"
      type="text" />
    <button
      class="v-inputSendButton_chatButton"
      @click="sendMessage">
      Отправить сообщение
    </button>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue';

const emit = defineEmits();

let message = ref('') as Ref<string>;

function sendMessage() {
  emit('sendMessage', message.value);
  message.value = '';
}
</script>

<style lang="scss">
.v-inputSendButton {
  display: flex;
  width: 80%;
  margin-top: 5px;
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
  justify-content: center;
  align-items: center;
  background-color: #141416;
  transition: 0.3s;
  border: none;

  &:hover {
    cursor: pointer;
    border: none;
    color: #000;
    background: #fff;
  }
}
</style>
