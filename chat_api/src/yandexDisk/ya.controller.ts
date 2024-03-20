import { Controller, Get } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { YandexDiskConnectorService } from './ya.service';

@Controller('ya_disk')
export class YandexDiskConnectorController {
  constructor(private readonly yandexDiskConnectorService: YandexDiskConnectorService) {}

  @Get('get_resourse')
  async connectionYaDiskResources(media_type: string = 'audio', fields: string, limit: string, offset: string) {
    const result = await this.yandexDiskConnectorService.connectionYaDisk(media_type, fields, limit, offset);
    console.log(result);
  }
}
