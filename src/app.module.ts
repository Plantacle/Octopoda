import { Module } from '@nestjs/common'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { MqttToInfluxModule } from './mqtt-to-influx/mqtt-to-influx.module'

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [MqttToInfluxModule],
})
export class AppModule {}
