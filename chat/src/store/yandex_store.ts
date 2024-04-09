import { yandexDiskApi } from '@/api/appApi';
import { defineStore } from 'pinia';

interface MusicType {
  tracks: Array<any>;
  playedTrack: {
    file: string;
    name: string;
  };
  isPlayed: boolean;
}

export const useYandexStore: any = defineStore('music_store', {
  state: () => {
    return {
      playedTrack: {
        file: '',
        name: '',
      },
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
      console.log(this.tracks);
      this.playedTrack = this.tracks.find((el) => el.file === pathFile);
    },
    setIsPlay(value: boolean) {
      if (value !== this.isPlayed) this.isPlayed = value;
    },
  },
});
