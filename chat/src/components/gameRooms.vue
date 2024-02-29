<template>
  <div class="v-gameRooms">
    <div
      v-for="(room, index) in gameStore.gameRooms"
      class="v-gameRoom"
    >
      <div class="v-gameRoom__roomName">{{ room.roomName }}</div>
      <div class="v-gameRoom__games">
        <div
          class="v-gameRoom__game"
          v-for="(dataGame, game) in room.games"
        >
          {{ game }}
        </div>
      </div>
      <div></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeMount, onMounted, onUnmounted, onUpdated, ref, watch } from 'vue';
import TicTacToe from '@/components/games/TicTacToe.vue';
import { useAuthStore } from '@/store/auth_store.ts';
import { useSocketStore } from '@/store/socket_store.ts';
import { useGameStore } from '@/store/game_store.ts';
import { useRoute } from 'vue-router';
import router from '@/router/router';

const route = useRoute();
const authStore = useAuthStore();
const gameStore = useGameStore();
const socketStore = useSocketStore();
</script>

<style scoped lang="scss">
.v-gameRooms {
  display: flex;
  justify-content: center;
  max-width: 80%;
  flex-wrap: wrap;
  gap: 50px;
  padding-top: 100px;
  align-self: flex-start;
}

.v-gameRoom {
  width: 200px;
  height: 150px;
  background-color: $darkBlack;
  margin: 10px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  transition: transform 0.3s ease;
  box-shadow: #0f0 0px 5px 20px 2px;

  &:hover {
    transform: translateY(-4px);
  }
}

.v-gameRoom__roomName {
  font-size: 1.5rem;
  border-bottom: 2px solid #0f0;
}

.v-gameRoom__games {
  font-size: 1.3rem;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.v-gameRoom__game {
  transition: transform 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
  }
}
</style>
