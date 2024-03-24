<template>
  <div
    class="v-music"
    ref="audioContainer"
  >
    <div
      class="v-music__track"
      v-for="(audio, index) in yaStore.music"
      :key="index"
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
        :class="{ active: isActive }"
        v-for="(isActive, index) in pagination"
        @click="onClickPaginationHandler(index + 1)"
      >
        {{ index + 1 }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { compile, computed, onMounted, ref, watch } from 'vue';
import { useYandexStore } from '@/store/yandex_store.ts';

const yaStore = useYandexStore();
const audioContainer = ref();
const currentPage = ref();
const pagination = ref([]) as any;

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
    pagination.value = new Array(Math.ceil(yaStore.music.length / 5)).fill(false);
    if (!currentPage.value) currentPage.value = 1;
  }
);

const currentPagination = computed(() => {});

watch(
  () => currentPage.value,
  () => {
    console.log('1', pagination.value);
    pagination.value = pagination.value.map((el: any, index: any) => {
      if (index + 1 === currentPage.value) return true;
      else return false;
    });
  }
);

function onClickPaginationHandler(index: number) {
  console.log(index);
}

onMounted(() => {
  yaStore.getMusicYaDisk();
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
  height: 90vh;

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
