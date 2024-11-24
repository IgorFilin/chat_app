<template>
  <div id="captcha-container"></div>
  <button @click="onClick">ОТПРАВИТЬ</button>
</template>
<script setup>
import yandexCaptcha from '../composable/yandexCaptcha';
function onClick() {
  execute();
}
const { execute } = yandexCaptcha();
</script>
<style lang="scss">
.test {
  position: relative;
  margin: 0 auto;
  font-size: 20px;
}
</style>
