import { Controller, Get, Req, Res } from '@nestjs/common';
import { YandexDiskConnectorService } from './ya.service';
import { Response, Request } from 'express';

@Controller('ya_disk')
export class YandexDiskConnectorController {
  constructor(private readonly yandexDiskConnectorService: YandexDiskConnectorService) {}

  @Get('get_resourse')
  async connectionYaDiskResources(@Req() req: Request, @Res() res: Response) {
    const result = await this.yandexDiskConnectorService.connectionYaDisk(req.query);
    res.status(201).send(result);
  }
}
