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
      :class="inputClass"
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
  inputClass: {
    type: String,
    desc: 'Дополнительный класс для инпута',
  },
});

function onChange(event: any) {
  emit('updateValue', event.currentTarget.value);
}
</script>

<style lang="scss">
.v-input {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.v-input__value {
  padding: 8px;
  border: none;
  background-color: #303030;

  &:focus {
    outline: none;
  }
}

.v-input__label {
  font-weight: bold;
}
</style>
