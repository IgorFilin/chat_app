import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class YandexDiskConnectorService {
  constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {}

  yaKey = this.configService.get('YA_DISK_AUTH');

  instanceHeaders = {
    Authorization: `OAuth ${this.yaKey}`,
  };

  async connectionYaDisk(media_type: string = 'audio', fields: string, limit: string, offset: string) {
    const queryObj = {
      media_type,
      fields,
      limit,
      offset,
    };
    for (const key in queryObj) {
      if (!queryObj[key]) delete queryObj[key];
    }
    const queryParams = new URLSearchParams(queryObj);
    console.log(queryParams.toString());
    const { data } = await firstValueFrom(
      this.httpService
        .get(`https://cloud-api.yandex.net/v1/disk/resources/files?${queryParams.toString()}`, {
          headers: this.instanceHeaders,
        })
        .pipe(
          catchError((error: AxiosError) => {
            throw error;
          })
        )
    );
    return data;
  }
}
