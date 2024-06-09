import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/user.module';
import { User } from './users/entities/user.entity';
import { UserKeyResetPass } from './users/entities/userKeyResetPass.entity';
import { EmailService } from './email/email.service';
import { StateService } from './state/state.service';
import { WebsocketModule } from './websocket/websocket.module';
import { CronModule } from './cron/cron.module';
import { Room } from './websocket/entities/room.entity';
import { Message } from './websocket/entities/message.entity';
import { YaModule } from './yandexDisk/ya.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { QuestionAnswerModule } from './q&a/q&a.module';
import { Question } from './q&a/entities/question.entity';
import { Answer } from './q&a/entities/answer.entity';

const configEnv = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'static/image'),
      serveRoot: '/static/image',
    }),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: configEnv,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('BD_HOST'),
        port: configService.get('BD_PORT'),
        username: configService.get('BD_USERNAME'),
        password: configService.get('BD_PASSWORD'),
        database: configService.get('BD_DATABASE'),
        entities: [User, Room, Message, UserKeyResetPass, Question, Answer],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    WebsocketModule,
    CronModule,
    YaModule,
    QuestionAnswerModule,
  ],
  controllers: [AppController],
  providers: [AppService, EmailService, StateService],
})
export class AppModule {}
