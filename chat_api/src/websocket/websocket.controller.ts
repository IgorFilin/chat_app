import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
} from '@nestjs/websockets';
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

  // @SubscribeMessage('message')
  // async handleMessage(@MessageBody() body: any) {
  //   await this.WebsocketService.broadcastMessage(
  //     body.id,
  //     body.message,
  //     body.roomId,
  //     body.isAllChat,
  //   );
  // }

  // @SubscribeMessage('all_messages_public')
  // async handleAllMessage(@MessageBody() body: any) {
  //   await this.WebsocketService.getAllMessagesPublicChat(body.id);
  // }

  // @SubscribeMessage('open_room')
  // async handleOpenPrivateRoom(
  //   @MessageBody() body: { myId: string; userId: string },
  // ) {
  //   await this.WebsocketService.openPrivateRoom(body.myId, body.userId);
  // }

  // @SubscribeMessage('invite_game')
  // async handleInviteGame(@MessageBody() body: any) {
  //   await this.WebsocketService.inviteGameUser(
  //     body.myId,
  //     body.userId,
  //     body.game,
  //     body.isAccept,
  //   );
  // }
  @SubscribeMessage('test')
  async test(@MessageBody() dto: any, @ConnectedSocket() client: Socket) {}

  async handleDisconnect(client: any) {
    const { sendClients } = await this.WebsocketService.disconnectUser(client);
    console.log(sendClients);
    this.server.emit('clients', { clients: sendClients });
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    const { sendClients } = await this.WebsocketService.connectedUser(client);
    this.server.emit('clients', { clients: sendClients });
  }
}
