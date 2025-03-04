import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { UserStore } from '../store/user/user.store';
import { IResponseUserDataWs, IUsersWs } from '../models/interfaces';
@Injectable({
  providedIn: 'root'
})
export class SocketClientService {
  private socket: any
  messages:any = signal([])
  typingUsers:WritableSignal<IUsersWs[]> = signal([])
  userStore = inject(UserStore)

  constructor() {
    this.initConnection()
  }

  initConnection() { 
    this.socket = new WebSocket(`ws://localhost:3001/ws/chat?id=${this.userStore.userInfoData()?.id}&name=${this.userStore.userInfoData()?.name}`);

    this.socket.onopen = () => {
      console.log("Соединение установлено");
    };

    this.socket
    
    this.socket.onmessage = (event:any) => {
      const eventData: IResponseUserDataWs = JSON.parse(event.data)
      switch(eventData.Event) {
        case 'start_typing':
          console.log('Пользователь начал печатать', eventData.Names)
          this.typingUsers.set(eventData.Names)
          break;
        case 'stop_typing':
          console.log('Пользователь закончил печатать')
          this.typingUsers.set(eventData.Names)
          break;
        default:
          this.messages.update((messages:any) => [...messages, eventData])
          break;
      }
    };
    
    this.socket.onclose = () => {
      console.log("Соединение закрыто");
    };
  }

  sendMessage(data:string) {
    this.socket.send(JSON.stringify({event:'', message: data}))
  }

  sendTypingEvent(isTyping:boolean) {
    let typing = isTyping ? 'start_typing' : 'stop_typing'
    this.socket.send(JSON.stringify({ event: typing }))
  }
}
