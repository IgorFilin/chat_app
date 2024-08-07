import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody, ConnectedSocket, OnGatewayConnection } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { WebsocketService } from './websocket.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebsocketController implements OnGatewayConnection {
  constructor(private readonly WebsocketService: WebsocketService) {}

  @WebSocketServer()
  private server: Server;

  @SubscribeMessage('getAllMessages')
  async handleAllMessage(@MessageBody() body: any) {
    await this.WebsocketService.getAllMessagesPublicChat(body.data.id);
  }

  @SubscribeMessage('isTypingUser')
  async handleisTypingMessage(@MessageBody() body: { roomId: string; userId: string; isTyping: boolean }) {
    await this.WebsocketService.setIsTypingMessageUser(body.roomId, body.userId, body.isTyping);
  }

  @SubscribeMessage('openRoom')
  async handleOpenPrivateRoom(@MessageBody() body: any) {
    await this.WebsocketService.openPrivateRoom(body.data.myId, body.data.userId);
  }

  @SubscribeMessage('inviteGame')
  async handleInviteGame(@MessageBody() body: any) {
    await this.WebsocketService.inviteGameUser(body.myId, body.userId, body.game, body.isAccept);
  }

  @SubscribeMessage('gameRoom')
  async gameRoom(@MessageBody() body: any) {
    await this.WebsocketService.gameRoom(body.action, body.userId, body.roomId, body.game);
  }

  @SubscribeMessage('gaming')
  async gameFlow(@MessageBody() body: any) {
    await this.WebsocketService.gameFlow(body.game, body.roomId, body.clickCell, body.userId, body.isClear);
  }

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() body: any) {
    const messages = await this.WebsocketService.broadcastMessage(body.data.id, body.data.message, body.data.roomId, body.data.isAllChat);
    if (messages) this.server.emit('message', messages);
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    const data = await this.WebsocketService.disconnectUser(client);
    this.server.emit('clients', { clients: data?.sendClients });
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    const data = await this.WebsocketService.connectedUser(client);
    this.server.emit('clients', { clients: data?.sendClients });
  }
}
