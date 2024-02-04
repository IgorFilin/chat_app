<template>
  <div class="v-games">
    <!-- <TextTyper
      class="v-games__title"
      deleteSpeed="60"
      :pauseFor="1500"
      delay="60"
      :text="title" /> -->
    <TicTacToe @changeBoard="(index) => tickTacToeHandler(index)" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUpdated, ref, watch } from 'vue';
// import TextTyper from '@/components/assetsComponent/TextTyper.vue';
import TicTacToe from '@/components/Games/TicTacToe.vue';
import { useAuthStore } from '@/store/auth_store.ts';
import { useSocketStore } from '@/store/socket_store.ts';
import { useGameStore } from '@/store/game_store.ts';
import { webSocketEntity } from '@/composable/socket.ts';

const authStore = useAuthStore();
const gameStore = useGameStore();
const socketStore = useSocketStore();

function tickTacToeHandler(index: any) {
  // gameStore.setTicTacToe(index, authStore.id);
  socket.emit('gaming', {
    game: 'ticTacToe',
    userId: authStore.id,
    roomId: gameStore.gameRoomId,
    clickCell: {
      index,
      symbol: gameStore.games['ticTacToe'].players[authStore.id].symbol,
    },
  });
}

let socket: any;

if (!socketStore.socketConnected) socket = webSocketEntity();
else socket = socketStore.socket;

const title = ref(['Добро пожаловать в игровую комнату', 'Тут вы можете подключиться к комнате в которую у вас есть доступ']);

socket.emit('gaming', { game: 'ticTacToe', roomId: gameStore.gameRoomId });
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
