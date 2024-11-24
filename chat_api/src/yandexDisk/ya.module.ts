import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { YandexDiskConnectorService } from './ya.service';
import { YandexDiskConnectorController } from './ya.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [YandexDiskConnectorController],
  providers: [YandexDiskConnectorService],
})
export class YaModule {}
