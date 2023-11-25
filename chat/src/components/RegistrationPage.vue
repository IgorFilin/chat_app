<template>
  <div class="registration-container">
    <h2 class="registration-title">Регистрация</h2>
    <form class="registration-form">
      <div class="form-group">
        <label for="name">Имя:</label>
        <input type="text" id="name" v-model="requestDataUser.name" />
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="requestDataUser.email" />
      </div>
      <div class="form-group">
        <label for="password">Пароль:</label>
        <input
          type="password"
          id="password"
          v-model="requestDataUser.password"
        />
      </div>
      <button class="registration-button" @click="submitForm">
        Зарегистрироваться
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/store/auth_store.ts";
import { onUpdated, ref, watch } from "vue";
import { RegisterUserType } from "@/api/typesApi";
import router from "@/router/router";

const requestDataUser = ref<RegisterUserType | {}>({
  name: "",
  email: "",
  password: "",
});

const store = useAuthStore();

function submitForm(e: Event) {
  e.preventDefault();
  store.registration(requestDataUser.value);
  requestDataUser.value = {};
}

watch(
  () => store.confirmReg,
  () => {
    if (store.confirmReg) {
      router.push("/confirm");
      store.confirmReg = false;
    }
  }
);
</script>

<style scoped lang="scss">
.registration-container {
  background-color: #202020;
  padding: 20px;
  color: white;
  max-width: 400px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  max-height: 600px;
  border-radius: 20px;
  margin: 20vh auto;
}

.registration-title {
  font-size: 24px;
  margin-bottom: 20px;
}

.registration-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
}

input {
  padding: 8px;
  border-radius: 4px;
  border: none;
  background-color: #f1f1f1;
}

input:focus {
  outline: none;
}

.registration-button {
  padding: 10px 20px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
}
</style>
