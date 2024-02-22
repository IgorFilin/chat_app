<template>
  <div class="v-ticTacToe">
    <Button
      @onClick="onLeaveGameRoom"
      text="Выйти из комнаты"
      isIcon
      iconId="arrow_back"
      iconColor="white"
    />
    <div class="v-ticTacToe__board">
      <div
        v-for="(cell, index) in gameStore.games['ticTacToe']?.board"
        @click.prevent.stop="onClickCell(index)"
        :key="index"
        :class="[
          { winner: gameStore.games['ticTacToe']?.patternWinner.includes(index) },
          ,
          { cross: cell === 'x' },
          { circle: cell === 'o' },
        ]"
        class="v-ticTacToe__cell"
      />
    </div>
    <div
      v-if="!gameStore.games['ticTacToe']?.winner"
      class="v-ticTacToe__nextMove"
    >
      Следующий ход за
      <span>
        {{ gameStore.games['ticTacToe']?.nextMove.name + `( ${gameStore.games['ticTacToe']?.nextMove.symbol} )` }}
      </span>
    </div>
    <div class="v-ticTacToe__scored">
      <div>Статистика:</div>
      <div v-for="stats in gameStore.games['ticTacToe']?.players">
        <span class="">{{ stats.name }}:</span>
        <span>{{ ' ' + stats.score }}</span>
      </div>
    </div>
    <div
      class="v-ticTacToe__winner"
      v-if="gameStore.games['ticTacToe']?.winner"
    >
      <span>Выйграл: {{ gameStore.games['ticTacToe']?.winner }}</span>
      <Button
        @onClick.stop="onClearBoard"
        text="Сбросить доску"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/store/game_store.ts';
import Button from '@/components/assetsComponent/Button.vue';
import router from '@/router/router';
import { useSocketStore } from '@/store/socket_store.ts';
import { useAuthStore } from '@/store/auth_store.ts';
import { nextTick, onMounted, watch } from 'vue';

const emit = defineEmits(['changeBoard', 'clearBoard']);

const gameStore = useGameStore();
const socketStore = useSocketStore();
const authStore = useAuthStore();

function onClickCell(index: number) {
  emit('changeBoard', index);
}

function onLeaveGameRoom() {
  router.push('/main');
}

function onClearBoard() {
  emit('clearBoard');
}

watch(
  [() => socketStore.socketConnected, () => gameStore.gameRoomId, () => authStore.id],
  () => {
    if (socketStore.socketConnected && gameStore.gameRoomId && authStore.id) {
      socketStore.socket.emit('gaming', { game: 'ticTacToe', roomId: gameStore.gameRoomId, userId: authStore.id });
    }
  },
  { immediate: true }
);
</script>

<style scoped lang="scss">
.v-ticTacToe {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  margin-top: 20px;
}

.v-ticTacToe__scored {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding-bottom: 3px;
}

.v-ticTacToe__board {
  width: 100%;
  height: 100%;
  max-width: 350px;
  max-height: 350px;
  background: $blue;
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  grid-template-columns: repeat(3, 1fr);
}

.v-ticTacToe__cell {
  border: 1px solid black;
  font-size: 90px;

  &.winner {
    background: $darkBlack;
  }

  &.circle {
    position: relative;

    &::before {
      content: '';
      position: absolute;
      width: 57px;
      height: 57px;
      border: 3px solid $skyBlue;
      border-radius: 50%;
      -webkit-box-shadow: 0 0 30px $skyBlue;
      box-shadow: 0 0 30px $skyBlue;
      transition: 1s;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  &.cross {
    position: relative;

    &::after,
    &::before {
      content: '';
      width: 5px;
      height: 70px;
      position: absolute;
      -webkit-box-shadow: 0 0 20px $skyBlue;
      border: 3px solid $skyBlue;
      background-color: $skyBlue;
      box-shadow: 0 0 20px $skyBlue;
      width: 60%;
      height: 4px;
      background-color: #000;
      top: 50%;
      left: 50%;
    }

    &::after {
      transform: translate(-50%, -50%) rotate(45deg);
    }

    &::before {
      transform: translate(-50%, -50%) rotate(-45deg);
    }
  }
}

.v-ticTacToe__winner {
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 20px;
}

.v-ticTacToe__winner,
.v-ticTacToe__scored,
.v-ticTacToe__nextMove {
  span {
    border-bottom: 2px solid white;
  }
}
</style>
