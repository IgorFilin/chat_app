import { Controller, Get } from '@nestjs/common';
import { YandexDiskConnectorService } from './ya.service';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Controller('ya_disk')
export class YandexDiskConnectorController {
  constructor(
    private readonly YandexDiskConnectorService: YandexDiskConnectorService,
    private readonly httpService: HttpService
  ) {}

  @Get('get_resourse')
  async connectionYaDisk() {
    const { data } = await firstValueFrom(
      this.httpService
        .get('https://cloud-api.yandex.net/v1/disk/', {
          headers: {
            Authorization: 'OAuth y0_AgAAAAAIUArrAAttTwAAAAD-CPaTAAAvZel8s1dDB7XJO5YsO4Cq-aYCEw',
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
