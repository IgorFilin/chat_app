import { inject, Injectable } from '@angular/core';
import { UserStore } from '../store/user/user.store';

@Injectable({
  providedIn: 'root',
})
export class SocketUsersService {
  socket: any;
  userStore = inject(UserStore);

  initConnection() {
    this.socket = new WebSocket(`ws://localhost:3002/ws/users?id=${this.userStore.userInfoData()?.id}&name=${this.userStore.userInfoData()?.name}`);

    this.socket.onopen = () => {
      console.log('Подключение к микросервису юзерс');
    };

    this.socket.onmessage = (event: any) => {
      console.log('event', event);
    };

    this.socket.onclose = () => {
      console.log('Подключение к микросервису юзерс закрыто');
    };

    this.socket.onerror = (error: any) => {
      console.log('Подключение к микросервису юзерс с ошибкой');
    };
  }
}
