import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import axios, { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

interface QueryGetFilesType {
  media_type?: string;
  fields?: string;
  limit?: string;
  offset?: string;
}
@Injectable()
export class YandexDiskConnectorService {
  constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {}

  yaKey = this.configService.get('YA_DISK_AUTH');

  instanceHeaders = {
    Authorization: `OAuth ${this.yaKey}`,
  };

  async connectionYaDisk(queryObj: QueryGetFilesType | any) {
    for (const key in queryObj) {
      if (!queryObj[key]) delete queryObj[key];
    }
    const queryParams = new URLSearchParams(queryObj);
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
    console.log(data.items.length);
    return data.items.map((el: any) => ({ name: el.name, file: el.file }));
  }
}
