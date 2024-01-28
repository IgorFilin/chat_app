import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { WebsocketService } from './websocket.service';

@WebSocketGateway()
export class WebsocketController {
  constructor(private readonly WebsocketService: WebsocketService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() body: any) {
    await this.WebsocketService.broadcastMessage(
      body.id,
      body.message,
      body.roomId,
      body.isAllChat,
    );
  }

  @SubscribeMessage('all_messages_public')
  async handleAllMessage(@MessageBody() body: any) {
    await this.WebsocketService.getAllMessagesPublicChat(body.id);
  }

  @SubscribeMessage('open_room')
  async handleOpenPrivateRoom(
    @MessageBody() body: { myId: string; userId: string },
  ) {
    await this.WebsocketService.openPrivateRoom(body.myId, body.userId);
  }

  @SubscribeMessage('invite_game')
  async handleInviteGame(@MessageBody() body: any) {
    console.log(body);
  }

  async handleDisconnect(disconnectedClient: any, ...args: any) {
    await this.WebsocketService.disconnectUser(disconnectedClient);
  }

  async handleConnection(client: Socket, ...args: any) {
    await this.WebsocketService.connectedUser(client, args);
  }
}
