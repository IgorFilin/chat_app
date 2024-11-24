<template>
  <div class="container">
    <div class="v-profile">
      <Button
        @onClick="goToPublicChat"
        class="v-profile__button"
        text="В общий чат"
        isIcon
        iconId="arrow_back"
        iconColor="white"
      />
      <div class="v-profile__content">
        <img
          class="v-profile__photo"
          :src="authStore.userPhoto"
          alt="аватар пользователя"
        />
        <TextTyper
          :key="mainText[0]"
          class="v-profile__userInfo"
          :text="mainText"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref, computed, nextTick, onMounted, onUnmounted, onUpdated, ref, watch, watchEffect } from 'vue';
import { useAuthStore } from '@/store/auth_store.ts';
import { useUserStore } from '@/store/user_store.ts';
import Button from '@/components/assetsComponent/Button.vue';
import TextTyper from '@/components/assetsComponent/TextTyper.vue';
import router from '@/router/router';
import { useRoute } from 'vue-router';

interface GeolocationDataType {
  ip: null | string;
  city: null | string;
  region: null | string;
  country: null | string;
  postal: null | string;
  currency: null | string;
}

const authStore = useAuthStore();
const userStore = useUserStore();
const route = useRoute();

function goToPublicChat() {
  router.push('/main');
}

const geolocationData = ref({
  ip: null,
  city: null,
  region: null,
  country: null,
  currency: null,
  postal: null,
}) as Ref<GeolocationDataType>;

const mainText = ref([]) as any;
const profileData = ref();
const userID = ref(route.params.id);
let timeoutId: any;

const isMe = computed(() => {
  return userID.value === authStore.id;
});

const user: any = computed(() => userStore.users.find((user: any) => user.id === userID.value));

watch(
  () => geolocationData.value,
  () => {
    profileData.value = `
-- Доступ разрешен --

 Имя: ${isMe.value ? authStore.name : user.value.name}

-- Доступ к базе данных --

connectToDatabase(${isMe.value ? authStore.name : user.value.name})
    ---------30%
    ---------50%
    ---------90%
    ---------100%

-- Доступ разрешен --

disconnectFromDatabase()

-- Конфиденциальная информация --

getUserInfo()

  Страна: ${geolocationData.value.country}
  ip-адресс: ${geolocationData.value.ip}
  Город: ${geolocationData.value.city}
  Регион: ${geolocationData.value.region}
  Почтовый-индекс: ${geolocationData.value.postal}
  Валюта: ${geolocationData.value.currency}
`;
    mainText.value = [
      `-- Подключаемся под пользователем --

setUserAgent('${isMe.value ? authStore.name : user.value?.name}')

...............................

`,
    ];
  }
);

watch(
  () => route.params.id,
  () => {
    userID.value = route.params.id;
    clearTimeout(timeoutId);
  }
);

watch(
  () => userID.value,
  async (newValue, oldValue) => {
    if (!Object.keys(userStore.users).length) {
      await userStore.getAllUsers();
    }
    if (newValue !== oldValue) {
      const result = await authStore.geolocation(user.value?.ip);
      if (result) {
        geolocationData.value = {
          ip: result.data.ip,
          city: result.data.city,
          region: result.data.region,
          country: result.data.country_name,
          currency: result.data.currency_name,
          postal: result.data.postal,
        };
      } else {
        geolocationData.value = {
          ip: 'Anonimous',
          city: 'Anonimous',
          region: 'Anonimous',
          country: 'Anonimous',
          currency: 'Anonimous',
          postal: 'Anonimous',
        };
      }
    }

    timeoutId = setTimeout(() => {
      mainText.value[0] = profileData.value;
    }, 5000);
  },
  { immediate: true }
);
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
