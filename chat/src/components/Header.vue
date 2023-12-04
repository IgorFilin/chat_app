<template>
  <div class="v-header__container">
    <div class="v-header__buttonsContainer">
      <Button
        v-for="({ text, redirect, show, isActive }, index) in navigateButtons"
        :class="{ active: isActive }"
        :text="text"
        v-show="show"
        class="v-header__navigateButton"
        @onClick="goTo(redirect, index)" />
    </div>
    <div class="v-header__nameLogoutContainer">
      <label for="download">
        <div v-if="store.isAuth">
          <img
            class="v-header__photoUser"
            :src="store.userPhoto"
            :key="store.userPhoto"
            alt="Аватар" />
          <input
            id="download"
            @change="downloadPhoto"
            hidden
            type="file"
            accept="image/webp,image/png" />
        </div>
      </label>
      <div
        class="v-header__userName"
        v-if="store.name">
        {{ store.name }}
      </div>
      <button
        v-if="store.isAuth"
        class="v-header__navigateButton"
        @click="onExitAccount">
        Выход
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from '@/router/router';
import { useAuthStore } from '@/store/auth_store';
import { onMounted, onUpdated, ref, watch } from 'vue';
import Button from '@/components/assetsComponent/Button.vue';

const store = useAuthStore();

let activeButton = ref([false, true]);

const navigateButtons = ref([
  {
    text: 'Регистрация',
    redirect: '/registration',
    show: true,
    isActive: false,
  },
  {
    text: 'Вход',
    redirect: '/login',
    show: true,
    isActive: false,
  },
  {
    text: 'Подтвердить почту',
    redirect: '/confirm',
    show: false,
    isActive: false,
  },
]);

function goTo(route: string, index: number) {
  setActivNavigationButton(route);
  router.push(route);
}
watch(
  [() => store.isAcceptKey, () => store.isAuth],
  () => {
    navigateButtons.value[0].show = !store.isAuth;
    navigateButtons.value[1].show = !store.isAuth;
    navigateButtons.value[2].show = store.isAcceptKey === false;
  },
  { immediate: true }
);

async function onExitAccount() {
  if (store.isAuth) {
    await store.logout();
    router.push('/login');
  }
}

function downloadPhoto(event: any) {
  const file = event.target.files[0];
  store.sendAvatarUser(file);
}

function setActivNavigationButton(path: string) {
  console.log(path);
  navigateButtons.value.map((button) => {
    button.isActive = button.redirect === path;
  });
}
onMounted(() => console.log(router.currentRoute.value.fullPath));
</script>

<style scoped lang="scss">
.v-header__container {
  background-color: #000000;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.v-header__buttonsContainer {
  display: flex;
  gap: 15px;
}

.v-header__navigateButton {
  font-size: 15px;
  background-color: initial;
  border: none;
  cursor: pointer;
  align-self: center;
  padding: 0;

  &.active {
    color: #e2e5e8;
  }
}

.v-header__nameLogoutContainer {
  display: flex;
  gap: 20px;
  align-self: center;
}

.v-header__photoUser {
  width: 40px;
  height: 40px;
  transition: 0.5s;
  border-radius: 50%;
  object-fit: cover;

  &:hover {
    transition: 0.5s;
    cursor: pointer;
    opacity: 0.8;
  }
}
.v-header__userName {
  text-decoration: underline;
  align-self: center;
}
</style>
