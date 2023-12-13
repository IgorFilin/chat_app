<template>
  <div class="v-input">
    <label
      class="v-input__label"
      v-if="labelText"
      :for="id">
      {{ labelText }}
    </label>
    <input
      :value="value"
      :id="id"
      :type="type"
      class="v-input__value"
      @input="onChange" />
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['updateValue']);
const props = defineProps({
  id: {
    type: String,
    desc: 'ID для связи с лейблом',
  },
  value: {
    type: String,
    desc: 'Значение инпута',
  },
  type: {
    type: String,
    desc: 'Тип инпута',
    default: 'text',
  },
  labelText: {
    type: String,
    desc: 'Текст наж полем ввода',
  },
});

function onChange(event: any) {
  emit('updateValue', event.currentTarget.value);
}
</script>

<style scoped lang="scss">
.v-input {
  display: flex;
  flex-direction: column;
  gap: 5px;
  .v-input__value {
    padding: 8px;
    border-radius: 4px;
    border: none;
    background-color: #303030;

    &:focus {
      outline: none;
    }
  }
  .v-input__label {
    font-weight: bold;
  }
}
</style>
