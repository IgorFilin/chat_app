import { Controller, Get } from '@nestjs/common';
import { YandexDiskConnectorService } from './ya.service';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';

@Controller('ya_disk')
export class YandexDiskConnectorController {
  constructor(
    private readonly YandexDiskConnectorService: YandexDiskConnectorService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {}

  @Get('get_resourse')
  async connectionYaDisk() {
    const yaKey = this.configService.get('YA_DISK_AUTH');
    const { data } = await firstValueFrom(
      this.httpService
        .get('https://cloud-api.yandex.net/v1/disk/', {
          headers: {
            Authorization: `OAuth ${yaKey}`,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            throw error;
          })
        )
    );
    console.log(data);
  }
}
