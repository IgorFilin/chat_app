<template>
  <Popup
    :inputs="inputs"
    @submit="(value) => console.log(value)" />
</template>
<script setup>
import Popup from '@/components/assetsComponent/Popup.vue';

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
</script>
<style lang="scss"></style>
