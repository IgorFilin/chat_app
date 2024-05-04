import { Injectable } from '@nestjs/common';
import { Cron, Timeout } from '@nestjs/schedule';

interface CronParamsType {
  time: string;
  name: string;
}

@Injectable()
export class CronService {
  @Cron('0 */1 * * * *')
  deleteKeyResetPass() {
    console.log('delete');
  }
}
