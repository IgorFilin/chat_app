import { Component, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SocketClientService } from '../../services/socket-client.service';

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
  
  constructor(
    private socketClientService: SocketClientService
  ) { }

  ngOnInit() {
  
  }

  sendMessage() { 
    this.socketClientService.sendMessage(this.message.value)
    this.message.reset()
  }

}
