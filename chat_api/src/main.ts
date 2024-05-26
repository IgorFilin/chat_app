import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as cookieParser from 'cookie-parser';
import fs from 'node:fs';
import express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import https from 'https';
import { ExtendedSocketIoAdapter } from './websocketExtendedAdapter/ExtendedSocketIoAdapter';

async function bootstrap() {
  const privateKey = fs.readFileSync('/etc/letsencrypt/live/filin-hub.online/privkey.pem', 'utf8');
  const certificate = fs.readFileSync('/etc/letsencrypt/live/filin-hub.online/fullchain.pem', 'utf8');

  const httpsOptions = { key: privateKey, cert: certificate };
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  const httpsServer = https.createServer(httpsOptions);

  app.use(cookieParser());
  app.enableCors({ origin: true, credentials: true });
  app.useWebSocketAdapter(new ExtendedSocketIoAdapter(httpsServer));
  await app.listen(3000);
}
bootstrap();
