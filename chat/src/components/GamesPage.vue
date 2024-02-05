<template>
  <div class="v-games">
    <TextTyper
      class="v-games__title"
      deleteSpeed="60"
      :pauseFor="1500"
      delay="60"
      :text="title" />
    <TicTacToe
      @changeBoard="
        (index) =>
          tickTacToeHandler({
            clickCell: {
              index,
              symbol: gameStore.games['ticTacToe'].players[authStore.id].symbol,
            },
          })
      "
      @clearBoard="() => tickTacToeHandler({ isClear: true })" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUpdated, ref, watch } from 'vue';
import TextTyper from '@/components/AssetsComponent/TextTyper.vue';
import TicTacToe from '@/components/Games/TicTacToe.vue';
import { useAuthStore } from '@/store/auth_store.ts';
import { useSocketStore } from '@/store/socket_store.ts';
import { useGameStore } from '@/store/game_store.ts';
import { webSocketEntity } from '@/composable/socket.ts';
import { useRoute } from 'vue-router';
import router from '@/router/router';

const route = useRoute();
const authStore = useAuthStore();
const gameStore = useGameStore();
const socketStore = useSocketStore();

function tickTacToeHandler(payload: any) {
  socket.emit('gaming', {
    game: 'ticTacToe',
    userId: authStore.id,
    roomId: gameStore.gameRoomId,
    ...payload,
  });
}
const title = ref(['Добро пожаловать в игровую комнату', 'Тут вы можете подключиться к комнате в которую у вас есть доступ']);

let socket: any;

onMounted(async () => {
  if (!socketStore.socketConnected) {
    await authStore.auth();
    gameStore.setRoomId(route.params.id);
    socket = webSocketEntity().socket;
  } else socket = socketStore.socket;

  socket.emit('gaming', { game: 'ticTacToe', roomId: gameStore.gameRoomId, userId: authStore.id });
});
</script>

<style scoped lang="scss">
.v-games {
  width: 100%;
  height: 90vh;
  text-align: center;
}

.v-games__title {
  font-size: 18px;
  position: relative;
  margin: 0 auto;
}
</style>
