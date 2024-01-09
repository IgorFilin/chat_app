<template>
  <div class="container">
    <div class="v-profile">
      <Button
        @onClick="goToPublicChat"
        class="v-profile__button"
        text="В общий чат"
        isIcon
        iconId="arrow_back"
        iconColor="white" />
      <div class="v-profile__content">
        <img
          class="v-profile__photo"
          :src="authStore.userPhoto"
          alt="аватар пользователя" />
        <TextTyper
          :key="mainText[0]"
          class="v-profile__userInfo"
          :text="mainText" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useAuthStore } from '@/store/auth_store.ts';
import { useUserStore } from '@/store/user_store.ts';
import Button from '@/components/assetsComponent/Button.vue';
import TextTyper from '@/components/assetsComponent/TextTyper.vue';
import router from '@/router/router';

const authStore = useAuthStore();

const userStore = useUserStore();

const id = new URLSearchParams(window.location.search).get('id');

function goToPublicChat() {
  router.push('/main');
}

const mainText = ref([
  `-- Подключаемся под пользователем --

setUserAgent('${authStore.name}')

...............................

`,
]);

const myProfile = `
-- Доступ разрешен --

 Имя: ${authStore.name}

-- Доступ к базе данных --

connectToDatabase(${authStore.name})
    ---------30%
    ---------50%
    ---------90%
    ---------100%

-- Доступ разрешен -- 

disconnectFromDatabase()

-- Конфиденциальная информация --

getUserInfo()

  Страна: ${authStore.geolocationData.country}
  ip-адресс: ${authStore.geolocationData.ip}
  Город: ${authStore.geolocationData.city}
  Регион: ${authStore.geolocationData.region}
  Почтовый-индекс: ${authStore.geolocationData.postal}
  Валюта: ${authStore.geolocationData.currency}
`;

const userIP = computed(() => userStore.users.find((user: any) => (user.id = id)));
console.log(userStore);
const userProfile = `ip: ${userIP}`;

onMounted(async () => {
  setTimeout(() => {
    if (id === authStore.id) {
      mainText.value[0] = myProfile;
    } else {
      mainText.value[0] = userProfile;
    }
  }, 5000);
});
</script>

<style scoped lang="scss">
.v-profile {
  width: 74%;
  height: 90vh;
}

.v-profile__button {
  margin: 10px 0;
}

.v-profile__photo {
  width: 120px;
  height: 120px;
}

.v-profile__content {
  margin-top: 100px;
  display: flex;
  gap: 100px;
}

.v-profile__userInfo {
  position: relative;
  top: 0;
  display: flex;
  font-size: 15px;
  line-height: 15px;
}
</style>
