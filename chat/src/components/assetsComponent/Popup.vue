<template>
  <div class="v-popup">
    <h2 class="v-popup__title">{{ title }}</h2>
    <form class="v-popup__form">
      <div class="v-popup__formGroup">
        <Input
          v-for="{ labelText, changeValue, id } in inputs"
          :key="id"
          :labelText="labelText"
          inputClass="v-popup__input"
          :type="id"
          :id="id"
          @updateValue="(dataInput) => onInputUpdated(dataInput, changeValue)" />
      </div>
      <Button
        class="v-popup__button"
        :isDisabled="isError"
        @onClick="onSubmit"
        text="Зарегистрироваться" />
    </form>
  </div>
</template>

<script setup lang="ts">
import { Ref, onUpdated, reactive, ref, watch } from 'vue';
import Button from '@/components/assetsComponent/Button.vue';
import Input from '@/components/assetsComponent/Input.vue';

type InputsType = { changeValue: string; labelText: string; id: string };

const props = defineProps({
  title: {
    type: String,
    desc: 'Заголовок попапа',
  },
  inputs: {
    type: Array<InputsType>,
    desc: 'Массив с инпутами',
  },
});

const inputData = ref({}) as any;
const isError = ref(true) as Ref<boolean>;

const emit = defineEmits(['submit']);

function onSubmit(event: any) {
  event.preventDefault();
  emit('submit', inputData.value);
}

watch(
  () => inputData.value,
  () => {
    if (Object.values(inputData.value).includes('')) {
      isError.value = true;
    }
  },
  { deep: true }
);

function onInputUpdated(dataInput: { value: string; error: boolean }, changeValue: string) {
  inputData.value[changeValue] = dataInput.value;
  isError.value = dataInput.error;
}
</script>

<style lang="scss">
.v-popup {
  background-color: #090909;
  box-shadow: #0f0 0px 10px 40px 4px;
  padding: 20px;
  color: white;
  max-width: 400px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  max-height: 600px;
  margin: 20vh auto;
}

.v-popup__title {
  font-size: 24px;
  margin-bottom: 20px;
}

.v-popup__form {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
}

.v-popup__formGroup {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 17px;
}

.v-popup__button {
  padding: 15px 20px;
  background: #053972;
  border: none;
  cursor: pointer;
  transition: 0.2s;
  margin: 0 auto 20px auto;
  width: 50%;

  &:hover {
    background: #1f5084;
    transition: 0.2s;
  }
}
</style>
