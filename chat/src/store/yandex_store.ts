import { yandexDiskApi } from '@/api/appApi';
import { defineStore } from 'pinia';

interface MusicType {
  tracks: Array<any>;
  playedTrack: {
    file: string;
    name: string;
    index: number;
  };
  isPlayed: boolean;
}

export const useYandexStore: any = defineStore('music_store', {
  state: () => {
    return {
      playedTrack: {
        file: '',
        name: '',
        index: 0,
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
      } catch (error) {}
    },
    setPlayedTrackPausedOrPlayed(pathFile: number) {
      this.playedTrack.index = this.tracks.findIndex((el) => el.file === pathFile);
      this.playedTrack.name = this.tracks[this.playedTrack.index].name;
      this.playedTrack.file = this.tracks[this.playedTrack.index].file;
    },
    setIsPlay(value: boolean) {
      if (value !== this.isPlayed) this.isPlayed = value;
    },
    setNextPrevTrack(value: 'prev' | 'next') {
      if (!this.playedTrack) return;
      const currentIndex = value === 'next' ? ++this.playedTrack.index : --this.playedTrack.index;
      this.playedTrack = {
        name: this.tracks[currentIndex].name,
        file: this.tracks[currentIndex].file,
        index: currentIndex,
      };
    },
  },
});
