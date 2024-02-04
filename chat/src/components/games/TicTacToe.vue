<template>
  <div class="v-ticTacToe">
    <div class="v-ticTacToe__board">
      <div class="v-ticTacToe__scored">
        <div>ОЧКИ:</div>
        <div v-for="(key, value) in gameStore.games['ticTacToe']?.players">{{ key }}</div>
      </div>
      <div
        v-for="(cell, index) in gameStore.games['ticTacToe']?.board"
        @click.prevent="onClickCell(index)"
        :key="index"
        :class="{ winner: gameStore.games['ticTacToe']?.patternWinner.includes(index) }"
        class="v-ticTacToe__cell">
        {{ cell }}
      </div>
    </div>
    <span
      class="v-ticTacToe__winner"
      v-if="gameStore.games['ticTacToe']?.winner">
      Победитель: {{ gameStore.games['ticTacToe']?.winner }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/store/game_store.ts';

const emit = defineEmits(['changeBoard']);

const gameStore = useGameStore();

function onClickCell(index: number) {
  // if (!winner.value) {
  //   isX = !isX;
  //   let value = isX ? 'x' : 'o';
  //   board[index] = value;
  emit('changeBoard', index);
  // }
}
</script>

<style scoped lang="scss">
.v-ticTacToe {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 50px;
}

.v-ticTacToe__scored {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
    background: red;
  }
}

.v-ticTacToe__winner {
  font-size: 25px;
}
</style>
