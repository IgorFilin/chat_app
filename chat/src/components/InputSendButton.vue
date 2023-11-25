<template>
  <div class="v-inputSendButton">
    <textarea
      @keyup.enter="sendMessage"
      v-model="message"
      class="v-inputSendButton__Input"
      type="text"
    />
    <button class="v-inputSendButton_chatButton" @click="sendMessage">
      Отправить сообщение
    </button>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref } from "vue";

const emit = defineEmits();

let message = ref("") as Ref<string>;

function sendMessage() {
  emit("sendMessage", message.value);
  message.value = "";
}
</script>

<style lang="scss">
.v-inputSendButton {
  display: flex;
  width: 80%;
}

.v-inputSendButton__Input {
  width: 100%;
  background-color: #ededed;
  padding-left: 10px;
  border: 1px solid #141416;
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
  color: #fff;
  background-color: #141416;
  transition: 0.5s;

  &:hover {
    border: 2px solid #000;
    color: #000;
    background-color: #fff;
  }
}
</style>
