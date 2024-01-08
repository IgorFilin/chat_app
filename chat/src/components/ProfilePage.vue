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
          :src="store.userPhoto"
          alt="аватар пользователя" />
        <!-- <div>Имя: {{ store.name }}</div> -->
        <TextTyper
          :key="userTextInfo[0]"
          class="v-profile__userInfo"
          :text="userTextInfo" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useAuthStore } from '@/store/auth_store.ts';
import Button from '@/components/assetsComponent/Button.vue';
import TextTyper from '@/components/assetsComponent/TextTyper.vue';
import router from '@/router/router';
const store = useAuthStore();

function goToPublicChat() {
  router.push('/main');
}

const userTextInfo = ref([
  `-- Подключаемся под пользователем --

setUserAgent('${store.name}')

...............................

`,
]);

const secondInfo = `
-- Доступ разрешен --

 Имя: ${store.name}

-- Доступ к базе данных --

connectToDatabase(${store.name})
    ---------30%
    ---------50%
    ---------90%
    ---------100%

-- Доступ разрешен -- 

disconnectFromDatabase()

-- Конфиденциальная информация --

getUserInfo()

  Страна: ${store.geolocationData.country}
  ip-адресс: ${store.geolocationData.ip},
  Город: ${store.geolocationData.city},
  Регион: ${store.geolocationData.region},
  Почтовый-индекс: ${store.geolocationData.postal},
  Валюта: ${store.geolocationData.currency}
`;

onMounted(async () => {
  setTimeout(() => {
    userTextInfo.value[0] = secondInfo;
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
  width: 150px;
  height: 150px;
}

.v-profile__content {
  margin-top: 100px;
  display: flex;
  gap: 70px;
}

.v-profile__userInfo {
  position: relative;
  top: 0;
  display: flex;
  font-size: 20px;
  line-height: 25px;
}
</style>
