<template>
  <div>
    <Button
      text="1"
      class="v-profile__button"
      @onClick="" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useAuthStore } from '@/store/auth_store.ts';
import Button from '@/components/assetsComponent/Button.vue';
import router from '@/router/router';

const store = useAuthStore();
</script>

<style scoped lang="scss"></style>
