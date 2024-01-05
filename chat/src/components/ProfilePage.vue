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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useAuthStore } from '@/store/auth_store.ts';
import Button from '@/components/assetsComponent/Button.vue';
import router from '@/router/router';
const store = useAuthStore();

function goToPublicChat() {
  router.push('/main');
}
</script>

<style scoped lang="scss">
.v-profile {
  width: 74%;
  height: 90vh;
}

.v-profile__button {
  margin: 10px 0;
}
</style>
