import { Module } from '@nestjs/common'
import { MeasurementsModule } from 'src/measurements/measurements.module'

import { MqttToInfluxService } from './mqtt-to-influx.service'

@Module({
  providers: [MqttToInfluxService],
  imports: [MeasurementsModule],
})
export class MqttToInfluxModule {}
