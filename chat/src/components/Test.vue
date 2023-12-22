<template>
  <input
    type="text"
    v-model="valueIn" />
  <button @click="textValue[1] = valueIn">1</button>
  <button @click="textValue[2] = valueIn">2</button>
  <button @click="(textValue[1] = ''), (textValue[2] = '')">CL</button>
  <TextTyper
    :key="textValue[1]"
    class="test"
    delay="50"
    element="div"
    @typeTextEnd="(e) => console.log(e)"
    :text="[textValue[1]]" />
  <TextTyper
    :key="textValue[2]"
    class="test"
    delay="50"
    element="div"
    @typeTextEnd="(e) => console.log(e)"
    :text="[textValue[2]]" />
</template>
<script setup>
import TextTyper from '@/components/assetsComponent/TextTyper.vue';
import { onUpdated, ref } from 'vue';
const valueIn = ref('');
const textValue = ref({});
const inputs = [
  {
    labelText: 'Имя:',
    changeValue: 'name',
    id: 'name',
  },
  {
    labelText: 'Почта:',
    changeValue: 'email',
    id: 'email',
  },
  {
    labelText: 'Пароль:',
    changeValue: 'password',
    id: 'password',
  },
];
onUpdated(() => {
  console.log(textValue.value);
});
</script>
<style lang="scss">
.test {
  position: relative;
  margin: 0 auto;
  font-size: 20px;
}
</style>
