import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Terminal } from '@xterm/xterm';
import { environment } from '../../../environments/environment';
import { UserStore } from '../../store/user/user.store';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss'],
})
export class TerminalComponent implements OnInit, OnDestroy {
  private term!: Terminal;
  private socket!: WebSocket;
  private chatUrl: string = environment.chatBaseUrl;
  userStore = inject(UserStore);
  constructor() {}

  ngOnInit() {
    this.initializeTerminal();
    this.connectWebSocket();
  }

  ngOnDestroy() {
    this.disconnectWebSocket();
  }

  private initializeTerminal() {
    this.term = new Terminal({
      fontSize: 14,
      fontFamily: 'Consolas, monospace',
      theme: {
        background: '#1e1e1e',
        foreground: '#ffffff',
        cursor: '#ffffff',
      },
    });

    const terminalElement = document.getElementById('terminal');
    if (terminalElement) {
      this.term.open(terminalElement);
      this.term.write('Connecting to WebSocket...\r\n');
    }

    // Обработка ввода с клавиатуры
    this.term.onData((data) => {
      console.log('123', data);
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(data);
      }
    });
  }

  private connectWebSocket() {
    const wsUrl = `ws://localhost:3003/ws/term?id=${this.userStore.userInfoData()?.id}&name=${this.userStore.userInfoData()?.name}`; // Замените на ваш URL
    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      this.term.write('\x1B[1;32mConnected to WebSocket server!\x1B[0m\r\n');
      this.term.write('$ ');
    };

    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'terminal_output') {
          this.term.write(message.data);
        }
      } catch (e) {
        this.term.write(event.data); // Если данные не JSON, выводим как есть
      }
    };

    this.socket.onclose = () => {
      this.term.write('\x1B[1;31mDisconnected from terminal\x1B[0m\r\n');
    };

    this.socket.onerror = (error) => {
      this.term.write(`\x1B[1;31mConnection error: ${error}\x1B[0m\r\n`);
    };
  }

  private disconnectWebSocket() {
    if (this.socket) {
      this.socket.close();
    }
  }
}
