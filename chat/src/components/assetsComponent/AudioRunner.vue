<template>
  <div class="v-audioRunner">
    <audio
      :autoplay="autoplay"
      :loop="loop"
      ref="audio"
      :src="audioSrc" />
    <Icon
      @click="settingVolume"
      class="v-audioRunner__sound"
      :class="iconClass"
      :id="isVolume ? 'sound_on' : 'sound_off'"
      color="orange" />
  </div>
</template>

<script setup>
import Icon from '@/components/assetsComponent/Icon.vue';
import { ref } from 'vue';

const props = defineProps({
  loop: {
    type: Boolean,
    default: true,
  },
  autoplay: {
    type: Boolean,
    default: true,
  },
  audioSrc: {
    type: String,
  },
  iconClass: {
    type: String,
  },
});

const audio = ref();

const isVolume = ref(true);

function settingVolume() {
  audio.value.volume = audio.value.volume ? 0 : 1;
  isVolume.value = !isVolume.value;
}
</script>

<style lang="scss">
.v-audioRunner__sound {
  width: 40px;
  height: 40px;
  position: absolute;
  right: 80px;
  bottom: 80px;

  &:hover {
    cursor: pointer;
    transform: scale(1.1);
  }
}
</style>
