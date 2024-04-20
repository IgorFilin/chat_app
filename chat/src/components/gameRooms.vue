<template>
  <div class="v-gameRooms">
    {{ gameStore.gameRooms }}
    <div
      v-for="(room, index) in gameStore.gameRooms"
      class="v-gameRoom"
    >
      <div class="v-gameRoom__roomName">Комната с {{ room.roomWithPlayer }}</div>
      <div class="v-gameRoom__games">
        <div
          class="v-gameRoom__game"
          v-for="{ game, totalUsers, usersOnline } in room.games"
        >
          <div class="v-gameRoom__gameTitle">
            {{ game }}
            <span>{{ `${usersOnline}/${totalUsers}` }}</span>
          </div>
          <div class="v-gameRoom__buttonsGroup">
            <Button
              class="v-gameRooms__button"
              @onClick="onEnterRoomHandler(room.id, game)"
              text="Войти"
            />
            |
            <Button
              class="v-gameRooms__button"
              @onClick="onLeaveRoomHandler(room.id, game)"
              text="Выйти"
            />
          </div>
        </div>
      </div>
      <div></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeMount, onMounted, onUnmounted, onUpdated, ref, watch } from 'vue';
import TicTacToe from '@/components/games/TicTacToe.vue';
import { useAuthStore } from '@/store/auth_store';
import { useSocketStore } from '@/store/socket_store';
import { useGameStore } from '@/store/game_store';
import { useRoute } from 'vue-router';
import router from '@/router/router';
import Button from '@/components/assetsComponent/Button.vue';

const route = useRoute();
const authStore = useAuthStore();
const gameStore = useGameStore();
const socketStore = useSocketStore();

function onEnterRoomHandler(roomId: string, game: string) {
  socketStore.socket.emit('gameRoom', {
    action: 'enter',
    userId: authStore.id,
    roomId: roomId,
    game,
  });
}

function onLeaveRoomHandler(roomId: string, game: string) {
  socketStore.socket.emit('gameRoom', {
    action: 'leave',
    userId: authStore.id,
    roomId: roomId,
    game,
  });
}
</script>

<style scoped lang="scss">
.v-gameRooms {
  display: flex;
  width: 100%;
  height: 90vh;
  max-width: 600px;
  gap: 20px;
  align-self: flex-start;
  flex-direction: column;
  overflow-y: scroll;
  margin: 20px auto auto auto;

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

.v-gameRoom__gameTitle {
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 10px;
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
  box-shadow: #0f0 0px 2px 8px 2px;
  gap: 10px;

  &:hover {
    transform: translateY(-2px);
  }
}

.v-gameRoom__roomName {
  align-self: center;
  font-size: 1.3rem;
  border-bottom: 2px solid #0f0;
}

.v-gameRoom__games {
  align-items: center;
  width: 100%;
  font-size: 1.3rem;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.v-gameRoom__game {
  display: flex;
  justify-content: space-between;
  transition: transform 0.3s ease;
  border: 2px solid black;
  padding: 4px;
  cursor: pointer;
  width: 100%;

  &:hover {
    transition: 0.1s;
    border: 2px solid $orange;
  }

  .v-icon {
    width: 24px;
    height: 24px;
  }
}

.v-gameRoom__buttonsGroup {
  align-items: center;
  display: flex;
}
</style>
