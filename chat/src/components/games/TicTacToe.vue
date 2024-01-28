<template>
  <div class="v-ticTacToe">
    {{ winner }}
    <div class="v-ticTacToe__board">
      <div
        v-for="(cell, index) in board"
        @click.prevent="onClickCell(index)"
        :key="index"
        class="v-ticTacToe__cell">
        {{ cell }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, watch } from 'vue';

const board = ref(Array(9)) as any;

const winner = ref('');

const patternWinner = ref([]) as any;

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
  () => board.value,
  () => {
    winsPatterns.forEach((arr: Array<number>) => {
      console.log('DEBUG');
      let tempValue = '';
      for (let i = 0; i < arr.length; i++) {
        let winnerIndex = arr[i];
        if (i === 0) {
          tempValue = board.value[winnerIndex];
        }
        if (tempValue !== board.value[winnerIndex]) {
          break;
        }
        if (i === 2) {
          winner.value = tempValue;
          patternWinner.value = arr;
        }
      }
    });
  }
);

function onClickCell(index: number) {
  board.value[index] = 'o';
}
</script>

<style scoped lang="scss">
.v-ticTacToe {
  width: 100%;
  height: 100%;
  display: flex;
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
}
</style>
