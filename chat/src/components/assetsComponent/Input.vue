<template>
  <div class="v-input">
    <label
      class="v-input__label"
      v-if="labelText"
      :for="id">
      {{ labelText }}
    </label>
    <input
      :value="modelValue"
      :id="id"
      :type="type"
      class="v-input__value"
      @input="$emit('update:modelValue', $event.currentTarget.value)" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  id: {
    type: String,
    desc: 'ID для связи с лейблом',
  },
  modelValue: {
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
