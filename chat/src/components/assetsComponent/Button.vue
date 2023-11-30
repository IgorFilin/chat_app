<template>
  <a
    v-if="href"
    class="v-button"
    :href="href"></a>
  <button
    v-else
    class="v-button"
    @click="onClick($event)">
    {{ text }}
  </button>
</template>

<script setup>
const emit = defineEmits(['onClick']);
const props = defineProps({
  text: {
    type: String,
    desc: 'Текст кнопки',
  },
  href: {
    type: String,
    desc: 'Ссылка кнопки',
  },
});

function onClick(event) {
  emit('onClick', event);
}
</script>

<style lang="scss">
.v-button {
  padding: 10px 20px;
  background-color: #053972;
  border: none;
  cursor: pointer;
}
</style>
