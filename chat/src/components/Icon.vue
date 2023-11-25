<template>
  <svg class="v-icon" :class="[color]">
    <use :xlink:href="`public/sprite.svg#${id}`" overflow="visible" />
  </svg>
</template>

<script setup>
const props = defineProps({
  id: {
    type: String,
    desc: "id иконки",
  },
  color: {
    type: String,
    desc: "цвет иконки",
  },
});
</script>

<style lang="scss">
.v-icon {
  width: 15px;
  height: 15px;

  &.white {
    color: white;
  }
}
</style>
