<template>
  <div class="v-input">
    <label
      class="v-input__label"
      v-if="labelText"
      :for="id">
      {{ labelText }}
    </label>
    <input
      :id="id"
      :type="type"
      v-model="inputValue"
      @blur="onBlur"
      :class="[inputClass, { error }]" />
    <div class="v-input__error">
      <span
        v-if="error"
        class="v-input__errorText">
        {{ error }}
      </span>
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
  changeValue: {
    type: String,
    desc: 'Какой инпут изменяется',
    validator(value: string) {
      return ['name', 'password', 'email', 'code'].includes(value);
    },
  },
});

function onBlur() {
  if (!inputValue.value.length) {
    error.value = '';
  }
}

watch([() => inputValue.value], () => {
  const value: any = inputValidator(inputValue.value, props.changeValue);
  if (value?.error) {
    error.value = value.error;
  } else {
    error.value = '';
  }
  emit('updateValue', { value: inputValue.value, error: !!error.value });
});
</script>

<style lang="scss">
.v-input {
  display: flex;
  flex-direction: column;
  gap: 10px;

  input {
    padding: 10px 15px;
    max-width: 195px;
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

    &:active {
      background: #1c1b1b;
    }

    &.error {
      border: 0.1px solid red;
    }
  }
}

.v-input__label {
  font-weight: bold;
}

.v-input__error {
  font-size: 14px;
  width: max-content;
  white-space: pre;
  position: relative;
  width: 100%;

  .v-input__errorText {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    max-width: 380px;
    top: -5px;
    z-index: 2;
    color: red;
  }
}
</style>
