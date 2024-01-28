<template>
  <div class="v-games">GAMES</div>
</template>

<script setup lang="ts">
import router from '@/router/router';
import { useAuthStore } from '@/store/auth_store';
import { onMounted, onUpdated, ref, watch } from 'vue';
import Button from '@/components/assetsComponent/Button.vue';

const store = useAuthStore();
</script>

<style scoped lang="scss"></style>
