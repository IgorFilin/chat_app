<template>
  <div class="v-input">
    <label
      class="v-input__label"
      v-if="labelText"
      :for="id">
      {{ labelText }}
    </label>
    <input
      :value="inputValue"
      :id="id"
      :type="type"
      v-model="inputValue"
      :class="[inputClass, { error }]" />
    <div
      v-if="error"
      class="v-input__error">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { inputValidator } from '@/composable/inputValidator.ts';
import { Ref, onUpdated, ref, watch } from 'vue';
const emit = defineEmits(['updateValue']);

const error = ref('') as Ref<any>;
const inputValue = ref('');

const props = defineProps({
  id: {
    type: String,
    desc: 'ID для связи с лейблом',
  },
  type: {
    type: String,
    desc: 'Тип инпута',
    default: 'text',
    validator(value: string) {
      return ['text', 'password', 'email'].includes(value);
    },
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

watch(
  () => inputValue.value,
  () => {
    const value: any = inputValidator(inputValue.value, props.type);
    if (value?.error) {
      error.value = value.error;
    } else {
      error.value = '';
    }
    // emit('updateValue', value);
  }
);
</script>

<style lang="scss">
.v-input {
  display: flex;
  flex-direction: column;
  gap: 10px;

  input {
    padding: 10px;
    border: none;
    background: #303030;
    transition: 0.2s;

    &:focus {
      outline: none;
    }

    &:hover {
      transition: 0.2s;
      background: #232121;
    }

    &.error {
      border: 2px solid red;
    }
  }
}

.v-input__label {
  font-weight: bold;
}

.v-input__error {
  font-size: 14px;
  word-break: break-word;
  max-width: 174px;
  text-align: center;
  color: #da2d2d;
}
</style>
