<template>
  <div class="v-confirmRef">
    <div class="v-confirmRef__container">
      <div class="v-confirmRef__text">
        Введите ключ подтверждение с вашего почтового ящика
      </div>
      <div class="v-confirmRef__inputCode">
        <input v-model="keyAccept" />
      </div>
      <button @click="sendKey">Отправить</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from "@/router/router";
import { useAuthStore } from "@/store/auth_store";
import { ref, watch } from "vue";

const keyAccept = ref("");

const store = useAuthStore();

function sendKey() {
  store.confirmRegistration(keyAccept.value);
  keyAccept.value = "";
}

watch(
  () => store.isAuth,
  () => {
    if (store.isAuth) {
      router.push("/main");
    }
  }
);
</script>

<style scoped lang="scss">
.v-confirmRef {
  width: 100%;
  height: 95vh;
}

.v-confirmRef__container {
  background-color: #202020;
  padding: 20px;
  color: white;
  max-width: 400px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  max-height: 600px;
  border-radius: 20px;
  margin: 20vh auto;
}

.v-confirmRef__inputCode {
  input {
    padding: 5px;
    height: 20px;
    width: 250px;
    border-radius: 2px;
    border: none;
    background-color: #f1f1f1;
  }
}
</style>
