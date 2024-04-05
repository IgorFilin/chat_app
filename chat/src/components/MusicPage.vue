<template>
  <div class="v-music">
    <div
      class="v-music__track"
      v-for="audio in tracks.slice(slicedCoord.start, slicedCoord.end)"
      :key="audio.file"
    >
      <Icon
        :id="isPlayed(audio.file) ? 'pause' : 'play'"
        class="v-music__icon"
        color="orange"
        @click="playOrPauseTrackHandler(audio.file, isPlayed(audio.file))"
      />
      <div class="v-music__name">{{ audio.name }}</div>
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
import Icon from '@/components/assetsComponent/Icon.vue';

const yaStore = useYandexStore();

const currentPage = ref(1);
const pagination = ref([]) as any;
const stepTracks = 3;
const slicedCoord = ref({ start: 0, end: 3 });

const tracks = ref([]) as any;

const isPlayed = (file: string) => yaStore.isPlayed && file === yaStore.playedTrack;

watch(
  () => yaStore.tracks,
  () => {
    const allPages = Math.ceil(yaStore.tracks.length / 3);
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
    }
    if (newValue < oldValue) {
      slicedCoord.value.start -= stepTracks;
      slicedCoord.value.end -= stepTracks;
    }
  }
);

function onClickPaginationHandler(index: number) {
  currentPage.value = index;
}

function playOrPauseTrackHandler(pathFile: string, isPlayed: any) {
  yaStore.setPlayedTrackPausedOrPlayed(pathFile, isPlayed ? yaStore.isPlayed : !yaStore.isPlayed);
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
  display: flex;
  align-items: center;
  gap: 15px;
  padding-left: 100px;
}

// .v-music__name {
//   margin-bottom: 10px;
// }

.v-music__icon {
  width: 25px;
  height: 25px;
  cursor: pointer;
  flex-shrink: 0;
}
</style>
