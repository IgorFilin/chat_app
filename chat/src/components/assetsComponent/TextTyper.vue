<template>
  <div class="v-typewriter">
    <vue-typewriter-effect
      :element="element"
      :strings="text"
      :delay="delay"
      :pauseFor="pauseFor"
      :onCreateTextNode="$emit('typeTextCreate')"
      :onRemoveNode="$emit('typeTextEnd')"
      :deleteSpeed="deleteSpeed" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  element: {
    type: String,
    desc: 'Элемент обёртки',
    default: 'pre',
  },
  text: {
    type: Array<string>,
    desc: 'Массив строк для печатающего текста',
    default: ['Hello'],
  },
  deleteSpeed: {
    type: String,
    desc: 'Скорость удаления, по умолчанию отключена',
    default: '999999',
  },
  pauseFor: {
    type: String,
    desc: 'Массив строк для печатающего текста',
    default: '10',
  },
  delay: {
    type: String,
    desc: 'Задержка после строк',
    default: '20',
  },
});
</script>

<style scoped lang="scss">
.v-typewriter {
  position: absolute;
  left: 0;
  top: 40px;
  z-index: -1;
  font-size: 15px;
}
</style>
