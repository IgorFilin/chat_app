<template>
  <div class="v-music"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useYandexStore } from '@/store/yandex_store.ts';

const yaStore = useYandexStore();

onMounted(() => {
  yaStore.getMusicYaDisk();
});
</script>

<style scoped lang="scss">
.v-music {
  max-width: 80%;
}
</style>
