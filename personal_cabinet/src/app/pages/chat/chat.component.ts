import { Component, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SocketClientService } from '../../services/socket-client.service';
import { debounceTime, tap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
  providers: [SocketClientService]
})
export class ChatComponent implements OnInit {

  message = new FormControl('')
  messages = computed(() => this.socketClientService.messages())
  typingUsers = computed(() => this.socketClientService.typingUsers())
  isTyping: boolean = false
  
  constructor(
    private socketClientService: SocketClientService
  ) { }

  ngOnInit() {
   this.watcherChangesMessage()
  }

  watcherChangesMessage() {
    this.message.valueChanges
    .pipe(
      tap(() => {
        if(!this.isTyping) {
          this.socketClientService.sendTypingEvent(true)
          this.isTyping = true
        }
      }),
      debounceTime(1000)
    )
    .subscribe((value) => {
      this.isTyping = false
      this.socketClientService.sendTypingEvent(false)
    })
  }

  sendMessage() { 
    const message: string = this.message.value|| ''
    this.socketClientService.sendMessage(message)
    this.message.reset('', { emitEvent: false })
  }
}
