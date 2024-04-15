<template>
  <div class="v-music">
    <div
      class="v-music__track"
      :class="{ pulse: isPlayedCurrentTrack(audio.file) }"
      v-for="audio in tracks.slice(slicedCoord.start, slicedCoord.end)"
      :key="audio.file"
      @click.stop="playOrPauseTrackHandler(audio.file)"
    >
      <Icon
        :id="isPlayedCurrentTrack(audio.file) ? 'pause' : 'play'"
        class="v-music__icon"
        color="orange"
      />
      <div
        :title="audio.name"
        class="v-music__name"
      >
        {{ audio.name }}
      </div>
    </div>
  </div>
  <div class="v-music__paginations">
    <div
      class="v-music__pagination"
      v-for="num in pagination"
      key="index"
      :class="{ active: currentPage === num }"
      @click="onClickPaginationHandler(num)"
    >
      <Icon
        id="round"
        class="v-music__icon"
        color="orange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useYandexStore } from '@/store/yandex_store.ts';
import Icon from '@/components/assetsComponent/Icon.vue';

const yaStore = useYandexStore();

const currentPage = ref(1);
const pagination = ref([]) as any;
const stepTracks = 8;
const slicedCoord = ref({ start: 0, end: 8 });

const tracks = ref([]) as any;

const isPlayedCurrentTrack = (file: string): boolean => {
  return yaStore.isPlayed && file === yaStore.playedTrack.file;
};

watch(
  () => yaStore.tracks,
  () => {
    const allPages = Math.ceil(yaStore.tracks.length / 8);
    pagination.value = Array.from({ length: allPages }, (el, i) => i + 1);
    if (!currentPage.value) currentPage.value = 1;
    tracks.value = yaStore.tracks;
  }
);

watch(
  () => currentPage.value,
  (newValue, oldValue) => {
    if (newValue > oldValue) {
      slicedCoord.value.start += stepTracks;
      slicedCoord.value.end += stepTracks;
    } else {
      slicedCoord.value.start -= stepTracks;
      slicedCoord.value.end -= stepTracks;
    }
  }
);

function onClickPaginationHandler(index: number) {
  currentPage.value = index;
}

function playOrPauseTrackHandler(pathFile: string) {
  yaStore.setPlayedTrackPausedOrPlayed(pathFile);
  yaStore.setIsPlay(!yaStore.isPlayed);
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
  max-height: 70vh;
  padding: 15px;

  @include tablets {
    grid-template-columns: 1fr;
    row-gap: 30px;
    overflow-y: scroll;
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
  margin: 0 auto;
  width: fit-content;
  color: unset;
}

.v-music__pagination {
  cursor: pointer;

  &.active {
    .v-icon {
      color: white;
    }
  }
}

.v-music__name {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  max-width: 300px;
  overflow: hidden;
}

.v-music__track {
  width: 300px;
  margin-bottom: 0;
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 15px;
  padding-left: 15px;
  border: 2px solid;
  height: 100%;
  cursor: pointer;
  transition: 0.4s;

  &.pulse {
    position: relative;
    animation: pulse 0.7s alternate infinite ease-in-out;
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      background-color: $darkBlack;
    }
    100% {
      transform: scale(1.05);
      background-color: $darkBlue;
    }
  }

  &:hover {
    transition: 0.4s;
    box-shadow: #0f0 0px 2px 8px 2px;
  }
}

.v-music__icon {
  width: 25px;
  height: 25px;
  cursor: pointer;
  flex-shrink: 0;
}
</style>
