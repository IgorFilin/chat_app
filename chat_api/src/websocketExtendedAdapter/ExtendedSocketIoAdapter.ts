import { IoAdapter } from '@nestjs/platform-socket.io';
import https from 'https';
import io from 'socket.io';

export class ExtendedSocketIoAdapter extends IoAdapter {
  protected ioServer: io.Server;

  constructor(protected server: https.Server) {
    super();

    const options = {
      cors: {
        origin: true,
        methods: ['GET', 'POST'],
        credentials: true,
      },
    };

    this.ioServer = new io.Server(server, options);
  }

  create(port: number) {
    console.log(
      'websocket gateway port argument is ignored by ExtendedSocketIoAdapter, use the same port of http instead'
    );
    return this.ioServer;
  }
}
