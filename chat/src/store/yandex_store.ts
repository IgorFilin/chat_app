import { yandexDiskApi } from '@/api/appApi';
import { defineStore } from 'pinia';

interface MusicType {
  tracks: Array<any>;
  isPlayedTrack: any;
  isPlayed: boolean;
}

export const useYandexStore: any = defineStore('music_store', {
  state: () => {
    return {
      isPlayedTrack: null,
      tracks: [],
      isPlayed: false,
    } as MusicType;
  },
  getters: {
    getPath(state) {
      return state.tracks;
    },
  },
  actions: {
    async getMusicYaDisk(queryObj: any = {}) {
      try {
        const result = await yandexDiskApi.getRecource(queryObj);
        this.tracks = result.data;
      } catch (error) {
      } finally {
      }
    },
    setPlayedTrack(pathFile: number) {
      this.isPlayedTrack = this.tracks.find((el) => el.file === pathFile).file;
      this.isPlayed = true;
    },
    setIsPlay(value: boolean) {
      this.isPlayed = value;
    },
  },
});
