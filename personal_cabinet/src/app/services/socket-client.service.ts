import { inject, Injectable, signal } from '@angular/core';
import { UserStore } from '../store/user/user.store';
import { IResponseUserDataWs } from '../models/interfaces';
@Injectable({
  providedIn: 'root'
})
export class SocketClientService {
  private socket: any
  messages:any = signal([])
  userStore = inject(UserStore)

  constructor() {
    this.initConnection()
  }

  initConnection() { 
    this.socket = new WebSocket(`ws://localhost:3001/ws/chat?id=${this.userStore.userInfoData()?.id}&name=${this.userStore.userInfoData()?.name}`);

    this.socket.onopen = () => {
      console.log("Соединение установлено");
      this.socket.send("Привет, сервер!");
    };

    this.socket
    
    this.socket.onmessage = (event:any) => {
      const data: IResponseUserDataWs = JSON.parse(event.data)
      this.messages.update((messages:any) => [...messages, data])
    };
    
    this.socket.onclose = () => {
      console.log("Соединение закрыто");
    };
  }

  sendMessage(data:any) {
    this.socket.send(JSON.stringify(data))
  }
}
