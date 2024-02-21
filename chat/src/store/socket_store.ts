import { defineStore } from 'pinia';
import { userApi } from '@/api/appApi';
import { useToast } from 'vue-toastification';
import { errorStore } from '@/utils/storeError';
import { io } from 'socket.io-client';
import { webSocketEntity } from '@/composable/socket.ts';

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
    async connectSocket(userId: string) {
      console.log(userId);
      const address = `${import.meta.env.VITE_APP_PROTOCOL}://${import.meta.env.VITE_APP_DOMEN_PORT}?userID=${userId}`;
      this.socket = io(address);
      this.socketConnected = true;
    },
    setConnectionSocket(value: boolean) {
      this.socketConnected = value;
    },
    setSocket(socket: any) {
      this.socket = socket;
    },
  },
});
