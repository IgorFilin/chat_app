<template>
  <div class="v-games">
    <!-- <TextTyper
      class="v-games__title"
      deleteSpeed="60"
      :pauseFor="1500"
      delay="60"
      :text="title" /> -->
    <TicTacToe />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUpdated, ref, watch } from 'vue';
// import TextTyper from '@/components/assetsComponent/TextTyper.vue';
import TicTacToe from '@/components/games/TicTacToe.vue';

const title = ref(['Добро пожаловать в игровую комнату', 'Тут вы можете подключиться к комнате в которую у вас есть доступ']);
</script>

<style scoped lang="scss">
.v-games {
  width: 100%;
  height: 90vh;
  text-align: center;
}

.v-games__title {
  font-size: 25px;
  position: relative;
  margin: 0 auto;
}
</style>
