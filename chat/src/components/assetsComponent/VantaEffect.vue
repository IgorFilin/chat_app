<template>
  <div
    ref="vantaEffect"
    class="v-vantaEffect" />
</template>

<script setup lang="ts">
//@ts-ignore
import Dots from 'vanta/dist/vanta.dots.min';
import { onMounted, ref } from 'vue';

const vantaEffect = ref() as any;

onMounted(() => {
  Dots({
    el: vantaEffect.value,
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.0,
    minWidth: 200.0,
    scale: 1.0,
    scaleMobile: 1.0,
    backgroundColor: 0x090909,
    size: 7.0,
    spacing: 70.0,
    showLines: false,
  });
});
</script>

<style lang="scss">
.v-vantaEffect {
  position: absolute;
  top: 0;
  left: 0;
  margin: 0 auto;
  width: 100%;
  height: 100vh;
  z-index: -2;
}
</style>
