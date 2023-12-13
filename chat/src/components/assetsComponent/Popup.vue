<template>
  <div class="registration-container">
    <h2 class="registration-title">Регистрация</h2>
    <form class="registration-form">
      <div class="form-group">
        <Input
          v-for="{ labelText, changeValue, id } in inputs"
          :labelText="labelText"
          :type="id"
          :id="id"
          @updateValue="(value) => (inputData[changeValue] = value)" />
      </div>
      <Button
        class="registration-button"
        @onClick="onSubmit"
        text="Зарегистрироваться" />
    </form>
  </div>
</template>

<script setup lang="ts">
import { Ref, onUpdated, ref, watch } from 'vue';
import Button from '@/components/assetsComponent/Button.vue';
import Input from '@/components/assetsComponent/Input.vue';

const props = defineProps({
  inputs: {
    type: Array<{ changeValue: string; labelText: string; id: string }>,
    desc: 'Массив с инпутами',
  },
});

const inputData = ref({}) as Ref<any>;

const emit = defineEmits(['submit']);

function onSubmit(event: any) {
  event.preventDefault();
  emit('submit', inputData.value);
}
</script>

<style scoped lang="scss">
.registration-container {
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

.registration-title {
  font-size: 24px;
  margin-bottom: 20px;
}

.registration-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
}

input {
  padding: 8px;
  border-radius: 4px;
  border: none;
  background-color: #303030;
}

input:focus {
  outline: none;
}

.registration-button {
  padding: 10px 20px;
  background-color: #053972;
  border: none;
  cursor: pointer;
  margin-bottom: 20px;
}
</style>
