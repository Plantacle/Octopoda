import { Module } from '@nestjs/common'

import { MqttToInfluxService } from './mqtt-to-influx.service'

@Module({
  providers: [MqttToInfluxService],
})
export class MqttToInfluxModule {}
