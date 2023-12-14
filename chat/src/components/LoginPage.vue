<template>
  <Popup
    :inputs="inputsLogin"
    title="Вход"
    @submit="onLogin" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useAuthStore } from '@/store/auth_store.ts';
import { LoginUserType } from '@/api/typesApi';
import Popup from '@/components/assetsComponent/Popup.vue';
import router from '@/router/router';

let email = ref('');
let password = ref('');

const inputsLogin = [
  {
    labelText: 'Почта:',
    changeValue: 'email',
    id: 'email',
  },
  {
    labelText: 'Пароль:',
    changeValue: 'password',
    id: 'password',
  },
];

const store = useAuthStore();

async function onLogin(data: LoginUserType) {
  store.loginAction(data);
}

watch(
  () => store.isAuth,
  () => {
    router.push('/main');
  }
);
</script>

<style scoped lang="scss">
.v-registration-container {
  background-color: #090909;
  box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.5);
  padding: 20px;
  color: white;
  max-width: 400px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  max-height: 600px;
  margin: 20vh auto;
}

.v-registration-title {
  font-size: 24px;
  margin-bottom: 20px;
}

.v-registration-form {
  display: flex;
  flex-direction: column;
}

.v-form-group {
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
  background-color: #303030;
  color: white;
}

input:focus {
  outline: none;
}

.v-registration-button {
  padding: 10px 20px;
  background-color: #053972;
  border: none;
  cursor: pointer;
  margin-bottom: 20px;
}
</style>
