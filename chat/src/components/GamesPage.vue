<template>
  <div class="v-games">
    <TicTacToe
      @changeBoard="
        (index) =>
          tickTacToeHandler({
            clickCell: {
              index,
              symbol: gameStore.getTicTacToe?.data?.nextMove?.symbol,
            },
          })
      "
      @clearBoard="() => tickTacToeHandler({ isClear: true })"
    />
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeMount, onMounted, onUnmounted, onUpdated, ref, watch } from 'vue';
import TicTacToe from '@/components/games/TicTacToe.vue';
import { useAuthStore } from '@/store/auth_store.ts';
import { useSocketStore } from '@/store/socket_store.ts';
import { useGameStore } from '@/store/game_store.ts';
import { useRoute } from 'vue-router';
import GameRooms from '@/components/GameRooms.vue';
import router from '@/router/router';

const route = useRoute();
const authStore = useAuthStore();
const gameStore = useGameStore();
const socketStore = useSocketStore();

function tickTacToeHandler(payload: any) {
  socketStore.socket.emit('gaming', {
    game: 'ticTacToe',
    userId: authStore.id,
    roomId: gameStore.currentGameRoom,
    ...payload,
  });
}

// gameStore.setCurrentRoomId(route.params.id);

// onMounted(() => {
//   watch(
//     [() => socketStore.socketConnected, () => gameStore.currentGameRoom, () => authStore.id],
//     () => {
//       if (socketStore.socketConnected && gameStore.currentGameRoom && authStore.id) {
//         socketStore.socket.emit('gameRoom', {
//           action: 'enter',
//           userId: authStore.id,
//           roomId: gameStore.currentGameRoom,
//           game: 'ticTacToe',
//         });
//       }
//     },
//     { immediate: true }
//   );
// });

// onUnmounted(() => {
//   socketStore.socket.emit('gameRoom', {
//     action: 'leave',
//     userId: authStore.id,
//     roomId: gameStore.currentGameRoom,
//     game: 'ticTacToe',
//   });
// });
</script>

<style scoped lang="scss">
.v-games {
  width: 100%;
  height: 90vh;
  display: flex;
  justify-content: center;
}

.v-games__title {
  font-size: 18px;
  position: relative;
  margin: 0 auto;
}
</style>
@/components/GameRooms.vue
