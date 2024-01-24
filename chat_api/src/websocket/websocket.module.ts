import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Room } from 'src/websocket/entities/room.entity';
import { Message } from './entities/message.entity';
import { WebsocketController } from './websocket.controller';
import { WebsocketService } from './websocket.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Room, Message])],
  providers: [WebsocketService, WebsocketController],
})
export class WebsocketModule {}
