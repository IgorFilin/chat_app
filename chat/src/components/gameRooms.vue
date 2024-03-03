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
          <span>{{ dataGame.usersOnline + '/' + dataGame.totalUsers }}</span>
          <span>
            <Icon
              id="exit"
              color="orange"
            />
          </span>
        </div>
      </div>
      <div></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeMount, onMounted, onUnmounted, onUpdated, ref, watch } from 'vue';
import TicTacToe from '@/components/games/TicTacToe.vue';
import Icon from '@/components/assetsComponent/Icon.vue';
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
  width: 80%;
  display: flex;
  gap: 50px;
  align-self: flex-start;
  flex-direction: column;
  overflow-y: scroll;
  height: 100%;

  &::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background-color: rgb(51, 51, 51);
    min-height: 24px;
    border: 3px solid rgb(245, 245, 245);
  }

  &::-webkit-scrollbar {
    width: 0.9rem;
  }
}

.v-gameRoom {
  height: 150px;
  background-color: $darkBlack;
  margin: 10px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: column;
  transition: transform 0.3s ease;
  gap: 10px;

  &:hover {
    transform: translateY(-4px);
  }
}

.v-gameRoom__roomName {
  align-self: center;
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
