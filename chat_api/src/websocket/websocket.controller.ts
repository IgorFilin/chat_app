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

  @SubscribeMessage('getAllMessages')
  async handleAllMessage(@MessageBody() body: any) {
    await this.WebsocketService.getAllMessagesPublicChat(body.data.id);
  }

  @SubscribeMessage('openRoom')
  async handleOpenPrivateRoom(@MessageBody() body: any) {
    await this.WebsocketService.openPrivateRoom(
      body.data.myId,
      body.data.userId,
    );
  }

  // @SubscribeMessage('invite_game')
  // async handleInviteGame(@MessageBody() body: any) {
  //   await this.WebsocketService.inviteGameUser(
  //     body.myId,
  //     body.userId,
  //     body.game,
  //     body.isAccept,
  //   );
  // }
  // @SubscribeMessage('test')
  // async test(@MessageBody() dto: any, @ConnectedSocket() client: Socket) {}

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() body: any) {
    const messages = await this.WebsocketService.broadcastMessage(
      body.data.id,
      body.data.message,
      body.data.roomId,
      body.data.isAllChat,
    );
    if (messages) this.server.emit('message', messages);
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    const { sendClients } = await this.WebsocketService.disconnectUser(client);
    console.log(sendClients);
    this.server.emit('clients', { clients: sendClients });
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    const { sendClients } = await this.WebsocketService.connectedUser(client);
    this.server.emit('clients', { clients: sendClients });
  }
}
