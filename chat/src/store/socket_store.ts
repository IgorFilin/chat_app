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
    setConnectionSocket(value: boolean) {
      this.socketConnected = value;
    },
    setSocket(socket: any) {
      this.socket = socket;
    },
  },
});
