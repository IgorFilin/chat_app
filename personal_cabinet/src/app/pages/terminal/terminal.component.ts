import { Component, OnInit, OnDestroy, inject, viewChild, ViewChild, ElementRef, WritableSignal, Signal } from '@angular/core';
import { Terminal } from '@xterm/xterm';
import { environment } from '../../../environments/environment';
import { UserStore } from '../../store/user/user.store';
import { isJson } from '../../shared/utils/functions';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss'],
})
export class TerminalComponent implements OnInit, OnDestroy {
  private term!: Terminal;
  private socket!: WebSocket;
  private teminalUrl: string = environment.teminalUrl;
  userStore = inject(UserStore);
  constructor() {}
  terminal: Signal<ElementRef<HTMLElement> | undefined> = viewChild('terminal');

  ngOnInit() {
    this.initializeTerminal();
    this.connectWebSocket();
  }

  ngOnDestroy() {
    this.disconnectWebSocket();
  }

  private initializeTerminal() {
    this.term = new Terminal({
      rows: 22,
      cols: 90,
      cursorBlink: true,
      disableStdin: false,
      windowsMode: false,
      theme: {
        foreground: '#F0F0F0', // Светло-серый текст
        background: '#1E1E1E', // Тёмный фон (как в VSCode)
        cursor: '#A0A0A0', // Умеренно-яркий курсор
      },
    });
    const termElem = this.terminal()?.nativeElement;
    if (termElem) {
      this.term.open(termElem);
      this.term.write('Подключаемся к терминалу...\r\n');
    }

    // Обработка ввода с клавиатуры
    this.term.onData((data) => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ type: 'input', data: data }));
      }
    });
  }

  private connectWebSocket() {
    const wsUrl = `${this.teminalUrl}/term?id=${this.userStore.userInfoData()?.id}&name=${this.userStore.userInfoData()?.name}`;
    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      this.term.write('\x1B[1;32mВы успешно подключились!\x1B[0m\r\n');
      this.term.write('$ ');
    };

    this.socket.onmessage = (event) => {
      let responseWsData = {
        type: '',
        data: null,
      } as any;
      if (!isJson(event.data)) {
        responseWsData.data = event.data;
      } else {
        const dataParsed = JSON.parse(event.data);
        if (dataParsed.hasOwnProperty('data')) {
          responseWsData = dataParsed;
        } else {
          responseWsData.data = dataParsed.toString();
        }
      }
      try {
        if (responseWsData.type === 'ready') {
          this.socket.send(
            JSON.stringify({
              type: 'ready',
              data: '',
            })
          );
        }
        this.term.write(responseWsData.data);
      } catch (e) {
        this.term.write(responseWsData.data);
      }
    };

    this.socket.onclose = () => {
      this.term.write('\x1B[1;31mОтключение от терминала\x1B[0m\r\n');
    };

    this.socket.onerror = (error) => {
      this.term.write(`\x1B[1;31mК сожалению произошла ошибка, попробуйте позднее\x1B[0m\r\n`);
    };
  }

  private disconnectWebSocket() {
    if (this.socket) {
      this.socket.close();
    }
  }
}
