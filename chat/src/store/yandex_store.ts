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
        const result = await yandexDiskApi.getRecource('test');
        this.music = result.data;
      } catch (error) {
      } finally {
      }
    },
  },
});
