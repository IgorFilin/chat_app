<template>
  <div class="v-ticTacToe">
    <Button
      @onClick="onLeaveGameRoom"
      text="Выйти из комнаты"
      isIcon
      iconId="arrow_back"
      iconColor="white" />
    <div class="v-ticTacToe__board">
      <div
        v-for="(cell, index) in gameStore.games['ticTacToe']?.board"
        @click.prevent.stop="onClickCell(index)"
        :key="index"
        :class="{ winner: gameStore.games['ticTacToe']?.patternWinner.includes(index) }"
        class="v-ticTacToe__cell">
        {{ cell }}
      </div>
    </div>
    <div class="v-ticTacToe__scored">
      <div>количество побед:</div>
      <div v-for="stats in gameStore.games['ticTacToe']?.players">
        <span>{{ stats.name }}:</span>
        <span>{{ ' ' + stats.score }}</span>
      </div>
    </div>
    <div
      class="v-ticTacToe__winner"
      v-if="gameStore.games['ticTacToe']?.winner">
      Победитель: {{ gameStore.games['ticTacToe']?.winner }}
      <Button
        @onClick.stop="onClearBoard"
        text="Сбросить доску" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/store/game_store.ts';
import Button from '@/components/assetsComponent/Button.vue';
import router from '@/router/router';

const emit = defineEmits(['changeBoard', 'clearBoard']);

const gameStore = useGameStore();

function onClickCell(index: number) {
  emit('changeBoard', index);
}

function onLeaveGameRoom() {
  router.push('/main');
}

function onClearBoard() {
  emit('clearBoard');
}
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
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 25px;
}
</style>
