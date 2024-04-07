import { yandexDiskApi } from '@/api/appApi';
import { defineStore } from 'pinia';

interface MusicType {
  tracks: Array<any>;
  playedTrack: any;
  isPlayed: boolean;
}

export const useYandexStore: any = defineStore('music_store', {
  state: () => {
    return {
      playedTrack: null,
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
    setPlayedTrackPausedOrPlayed(pathFile: number) {
      this.playedTrack = this.tracks.find((el) => el.file === pathFile).file;
    },
    setIsPlay(value: boolean) {
      if (value !== this.isPlayed) this.isPlayed = value;
    },
  },
});
