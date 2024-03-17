import { yandexDiskApi } from '@/api/appApi';
import { defineStore } from 'pinia';

interface MusicType {
  music: Array<any>;
}

export const useYandexStore: any = defineStore('music_store', {
  state: () => {
    return {
      music: [],
    } as MusicType;
  },
  getters: {
    getPath(state) {
      return state.music;
    },
  },
  actions: {
    async getMusicYaDisk() {
      try {
        const response = yandexDiskApi.getRecource('test');
        console.log(response);
      } catch (error) {
      } finally {
      }
    },
  },
});
