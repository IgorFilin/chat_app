import { Controller, Get } from '@nestjs/common';
import { YandexDiskConnectorService } from './ya.service';
import { SetHeadersMiddleware } from 'src/middleware/setHeaders.middleware';

@Controller('ya_disk')
export class YandexDiskConnectorController {
  constructor(private readonly YandexDiskConnectorService: YandexDiskConnectorService) {}

  @Get('get_resourse')
  async connectionYaDisk() {
    console.log('test');
  }
}
