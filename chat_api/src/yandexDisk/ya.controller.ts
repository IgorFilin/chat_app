import { Controller, Get, Req, Res } from '@nestjs/common';
import { YandexDiskConnectorService } from './ya.service';
import { Response, Request } from 'express';

@Controller('ya_disk')
export class YandexDiskConnectorController {
  constructor(private readonly yandexDiskConnectorService: YandexDiskConnectorService) {}

  @Get('get_resourse')
  async connectionYaDiskResources(
    media_type: string = 'audio',
    fields: string,
    limit: string,
    offset: string,
    @Res() res: Response
  ) {
    const result = await this.yandexDiskConnectorService.connectionYaDisk(media_type, fields, limit, offset);
    res.status(201).send(result);
  }
}
