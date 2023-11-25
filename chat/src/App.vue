<template>
  <Header />
  <transition name="fade" mode="out-in">
    <router-view></router-view>
  </transition>
  <Loader v-if="store.isLoading" />
</template>

<script lang="ts" setup>
import Header from "@/components/Header.vue";
import Loader from "@/components/Loader.vue";
import { useAuthStore } from "./store/auth_store";
import { onMounted } from "vue";

const store = useAuthStore();

onMounted(() => {
  if (!store.isAuth) {
    store.auth();
  }
});
</script>
<style lang="scss">
body {
  margin: 0;
  padding: 0;
  font-family: "BlinkMacSystemFont", "Roboto", "Helvetica Neue", Geneva,
    "Noto Sans Armenian", "Noto Sans Bengali", "Noto Sans Cherokee",
    "Noto Sans Devanagari", "Noto Sans Ethiopic", "Noto Sans Georgian",
    "Noto Sans Hebrew", "Noto Sans Kannada", "Noto Sans Khmer", "Noto Sans Lao",
    "Noto Sans Osmanya", "Noto Sans Tamil", "Noto Sans Telugu", "Noto Sans Thai",
    arial, Tahoma, verdana, sans-serif;
}
#app {
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>
