import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { CronService } from './cron.service';

@Module({
  providers: [CronService],
})
export class CronModule {}
