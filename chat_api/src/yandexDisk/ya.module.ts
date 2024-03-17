import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { SetHeadersMiddleware } from 'src/middleware/setHeaders.middleware';
import { YandexDiskConnectorService } from './ya.service';
import { YandexDiskConnectorController } from './ya.controller';

@Module({
  imports: [],
  controllers: [YandexDiskConnectorController],
  providers: [YandexDiskConnectorService],
})
export class YaModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SetHeadersMiddleware).forRoutes('ya_disk');
  }
}
