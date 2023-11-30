<template>
  <div class="registration-container">
    <h2 class="registration-title">Регистрация</h2>
    <form class="registration-form">
      <div class="form-group">
        <Input
          labelText="Имя:"
          type="text"
          id="text"
          v-model="requestDataUser.name" />
        <Input
          labelText="Почта:"
          type="email"
          id="email"
          v-model="requestDataUser.email" />
        <Input
          labelText="Пароль:"
          type="password"
          id="password"
          v-model="requestDataUser.password" />
      </div>
      <Button
        class="registration-button"
        @onClick="submitForm"
        text="Зарегистрироваться" />
    </form>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/auth_store.ts';
import { onUpdated, ref, watch } from 'vue';
import { RegisterUserType } from '@/api/typesApi';
import Input from '@/components/assetsComponent/Input.vue';
import Button from '@/components/assetsComponent/Button.vue';

const requestDataUser = ref<RegisterUserType>({
  name: '',
  email: '',
  password: '',
});

const store = useAuthStore();

function submitForm(e: Event) {
  e.preventDefault();
  store.registration(requestDataUser.value);
  requestDataUser.value = {
    name: '',
    email: '',
    password: '',
  };
}
</script>

<style scoped lang="scss">
.registration-container {
  background-color: #202020;
  box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.5);
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
  gap: 10px;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
}

input {
  padding: 8px;
  border-radius: 4px;
  border: none;
  background-color: #303030;
}

input:focus {
  outline: none;
}

.registration-button {
  padding: 10px 20px;
  background-color: #053972;
  border: none;
  cursor: pointer;
  margin-bottom: 20px;
}
</style>
