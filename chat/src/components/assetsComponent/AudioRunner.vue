<template>
  <div class="v-audioRunner">
    <Icon
      @click="isPlayed = !isPlayed"
      class="v-audioRunner__sound"
      :class="[iconClass, { soundOff: !isPlayed }]"
      :id="isPlayed ? 'sound_on' : 'sound_off'"
      color="orange" />
  </div>
</template>

<script setup>
import Icon from '@/components/assetsComponent/Icon.vue';
import { ref, watch } from 'vue';
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

const isPlayed = ref(false);

const audio = new Audio(props.audioSrc);
audio.autoplay = props.autoplay;
audio.loop = props.loop;

watch(
  () => isPlayed.value,
  () => {
    if (!isPlayed.value) {
      audio.pause();
      audio.currentTime = 0.0;
    } else {
      audio.play();
    }
  }
);
</script>

<style lang="scss">
.v-audioRunner__sound {
  width: 40px;
  height: 40px;
  position: absolute;
  right: 80px;
  bottom: 80px;

  &.soundOff {
    @keyframes shake {
      20%,
      60% {
        transform: translateX(0);
      }
      20% {
        transform: scale(1.1);
      }
    }
    animation: shake 0.5s ease infinite;
  }

  &:hover {
    cursor: pointer;
    animation: none;
    transform: scale(1.1);
  }
}
</style>
