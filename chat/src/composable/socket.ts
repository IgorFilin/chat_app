import { reactive } from 'vue';
import { io } from 'socket.io-client';
import { useAuthStore } from '@/store/auth_store.ts';

export function webSocketEntity() {
  const store = useAuthStore();

  const state = reactive({
    connected: false,
    onlineClients: [],
  });

  // "undefined" means the URL will be computed from the `window.location` object
  const URL = `${import.meta.env.VITE_APP_PROTOCOL}://${import.meta.env.VITE_APP_DOMEN_PORT}?userID=${store.id}`;

  const socket = io(URL);

  socket.on('connect', () => {
    state.connected = true;
    console.log('CONNECTED');
  });

  socket.on('disconnect', () => {
    state.connected = false;
  });

  socket.on('clients', (data) => {
    state.onlineClients = data.clients;
  });

  return { state, socket };
}
