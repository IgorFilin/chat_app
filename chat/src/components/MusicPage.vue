<template>
  <div
    class="v-music"
    ref="audioContainer"
  >
    <div
      class="v-music__track"
      v-for="(audio, index) in tracks.slice(start, end)"
      :key="audio.name + index"
    >
      <div class="v-music__name">{{ audio.name }}</div>
      <div>
        <audio
          controls
          @play="onChangeHandler(index)"
        >
          <source
            :src="audio.file"
            type="audio/mpeg"
          />
          Ваш браузер не поддерживает аудиоэлемент.
        </audio>
      </div>
    </div>
    <div class="v-music__paginations">
      <div
        class="v-music__pagination"
        :class="{ active: currentPage === num }"
        v-for="(num, index) in pagination"
        key="index"
        @click="onClickPaginationHandler(num)"
      >
        {{ num }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useYandexStore } from '@/store/yandex_store.ts';

const yaStore = useYandexStore();
const audioContainer = ref();
const currentPage = ref();
const pagination = ref([]) as any;
const stepTracks = 3;
const start = ref(0);
const end = ref(3);
const tracks = ref([]) as any;

function onChangeHandler(idTrack: number) {
  const tracks = audioContainer.value.querySelectorAll('audio');
  tracks.forEach((audio: any, index: number) => {
    if (idTrack !== index) {
      audio.pause();
      audio.currentTime = 0;
    }
  });
}

watch(
  () => yaStore.music,
  () => {
    const allPages = Math.ceil(yaStore.music.length / 3);
    pagination.value = Array.from({ length: allPages }, (el, i) => i + 1);
    if (!currentPage.value) currentPage.value = 1;
    tracks.value = yaStore.music;
  }
);

watch(
  () => currentPage.value,
  (newValue, oldValue) => {
    if (newValue > oldValue) {
      start.value += stepTracks;
      end.value += stepTracks;
    }
    if (newValue < oldValue) {
      start.value -= stepTracks;
      end.value -= stepTracks;
    }
  }
);

function onClickPaginationHandler(index: number) {
  currentPage.value = index;
}

onMounted(() => {
  yaStore.getMusicYaDisk({ media_type: 'audio' });
});
</script>

<style scoped lang="scss">
.v-music {
  max-width: 1000px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 20px;
  margin: 40px auto;
  justify-items: center;
  overflow-y: scroll;
  max-height: 500px;

  @include tablets {
    grid-template-columns: 1fr;
    row-gap: 30px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background-color: rgb(51, 51, 51);
    min-height: 24px;
    border: 3px solid rgb(245, 245, 245);
  }

  &::-webkit-scrollbar {
    width: 0.9rem;
  }
}

.v-music__paginations {
  display: flex;
  gap: 10px;
}

.v-music__pagination {
  cursor: pointer;

  &.active {
    color: white;
  }
}

.v-music__track {
  width: 300px;
  margin-bottom: 0;
  margin-top: auto;
}

.v-music__name {
  margin-bottom: 10px;
}

audio::-webkit-media-controls-panel {
  background-color: $skyBlue;
  border-radius: 0;
  outline: none;
}

audio::-webkit-media-controls-play-button {
  color: $darkBlue;
}

audio::-webkit-media-controls-enclosure {
  border-radius: 0;
}

audio::-webkit-media-controls-current-time-display {
  color: $darkBlue;
}

audio::-webkit-media-controls-time-remaining-display {
  color: $darkBlue;
}

audio::-webkit-media-controls-volume-slider {
  color: $darkBlue;
}
</style>
