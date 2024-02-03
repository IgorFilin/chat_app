<template>
  <div class="v-ticTacToe">
    <div class="v-ticTacToe__board">
      <div
        v-for="(cell, index) in board"
        @click.prevent="onClickCell(index)"
        :key="index"
        :class="{ winner: patternWinner.includes(index) }"
        class="v-ticTacToe__cell">
        {{ cell }}
      </div>
    </div>
    <span
      class="v-ticTacToe__winner"
      v-if="winner">
      Победитель: {{ winner }}
    </span>
    {{ patternWinner }}
  </div>
</template>

<script setup lang="ts">
import { Ref, reactive, ref, watch } from 'vue';
import { useGameStore } from '@/store/game_store.ts';

const emit = defineEmits(['changeBoard']);

const gameStore = useGameStore();

const board = reactive(gameStore.games['ticTackToe']) as any;

const winner = ref('');

const patternWinner = ref([]) as any;

let isX = false;

const winsPatterns = [
  [0, 4, 8],
  [2, 4, 6],
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
];

watch(
  () => board,
  () => {
    let potencialWinner = '';
    let isWin = winsPatterns.some((array) => {
      let winPattern = array.every((el, indexEl) => {
        if (board[el] && indexEl === 0) {
          potencialWinner = board[el];
          return true;
        }
        if (indexEl > 0) {
          return board[el] === potencialWinner;
        }
      });
      if (winPattern) {
        patternWinner.value = array;
        return true;
      }
    });
    if (isWin) winner.value = potencialWinner;
  }
);

function onClickCell(index: number) {
  if (!winner.value) {
    isX = !isX;
    let value = isX ? 'x' : 'o';
    board[index] = value;
    emit('changeBoard', board);
  }
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
