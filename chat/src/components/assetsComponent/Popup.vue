<template>
  <div class="v-popup">
    <h2
      class="v-popup__title"
      v-html="title"
    ></h2>
    <form class="v-popup__form">
      <div class="v-popup__formGroup">
        <Input
          v-if="inputs"
          v-for="{ labelText, changeValue, id } in inputs"
          :key="id"
          :labelText="labelText"
          :changeValue="changeValue"
          :clear="clearInputs"
          @cleared="clearInputs = false"
          inputClass="v-popup__input"
          :type="id"
          :id="id"
          @reset=""
          @updateValue="(dataInput) => onInputUpdated(dataInput, changeValue)"
        />
      </div>
      <div class="v-popup__slotAdditional">
        <slot name="additional"></slot>
      </div>
      <div id="captcha-container"></div>
      <Button
        v-if="buttonText"
        class="v-popup__button"
        :isDisabled="isError"
        @onClick="onSubmit"
        :text="buttonText"
      />
    </form>
    <Icon
      v-if="isCloseBtn"
      class="v-popup__iconClose"
      @click="emit('onClose')"
      id="close-cross"
      color="orange"
    />
  </div>
</template>

<script setup lang="ts">
import { Ref, onMounted, onUnmounted, onUpdated, reactive, ref, watch } from 'vue';
import Button from '@/components/assetsComponent/Button.vue';
import Input from '@/components/assetsComponent/Input.vue';
import Icon from '@/components/assetsComponent/Icon.vue';
import yandexCaptcha from '@/composable/yandexCaptcha.js';
type InputsType = { changeValue: string; labelText: string; id: string };

const getCaptchaResponse = yandexCaptcha();

const props = defineProps({
  title: {
    type: String,
    desc: 'Заголовок попапа',
  },
  buttonText: {
    type: String,
    desc: 'Текст кнопки',
  },
  inputs: {
    type: Array<InputsType>,
    desc: 'Массив с инпутами',
  },
  isCloseBtn: {
    type: Boolean,
    desc: 'Флажок для включения иконки закрытия и возвращения события закрытия',
    default: false,
  },
});

const inputData = ref({}) as any;
const isError = ref(true) as Ref<boolean>;
const clearInputs = ref(false) as Ref<boolean>;

const emit = defineEmits(['submit', 'onClose']);

async function onSubmit(event: any) {
  event.preventDefault();
  let isNotRobot;
  if (getCaptchaResponse) {
    isNotRobot = await getCaptchaResponse();
  } else {
    isNotRobot = true;
  }
  if (isNotRobot) {
    emit('submit', inputData.value);
    clearInputs.value = true;
    inputData.value = {};
  }
}

watch(
  () => inputData.value,
  () => {
    if (
      Object.values(inputData.value).includes('') ||
      (props.inputs?.length && Object.values(inputData.value).length < props.inputs?.length)
    ) {
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
  position: relative;
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
  z-index: 999999;
  transition: opacity 0.5s ease;
}

.v-popup__title {
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
}

.v-popup__form {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.v-popup__formGroup {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 17px;
}

.v-popup__slotAdditional {
  margin-top: 15px;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 5px;

  .sendButton {
    &:hover {
      cursor: pointer;
    }
  }

  .disabled {
    opacity: 0.3;

    &:hover {
      cursor: default;
    }
  }
}

.v-popup__button {
  padding: 15px 20px;
  background: #053972;
  border: none;
  cursor: pointer;
  transition: 0.2s;
  margin: 30px auto 20px auto;
  width: 50%;

  &:hover {
    background: #1f5084;
    transition: 0.2s;
  }
}

.v-popup__iconClose {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 20px;
  height: 20px;

  &:hover {
    cursor: pointer;
    transform: scale(1.1);
  }
}

.v-popup__Link {
  color: $skyBlue;
  cursor: pointer;
}
</style>
