import { defineStore } from 'pinia';
import { userApi } from '@/api/appApi';
import { useToast } from 'vue-toastification';
import { errorStore } from '@/utils/storeError';

interface SocketStoreType {
  socket: any;
  socketConnected: boolean;
}

const toast = useToast();

export const useSocketStore: any = defineStore('socket_store', {
  state: () => {
    return {
      socket: null,
      socketConnected: false,
    } as SocketStoreType;
  },
  getters: {},
  actions: {
    setConnectionSocket(socket: any, value: boolean) {
      this.socket = socket;
      this.socketConnected = value;
    },
  },
});
