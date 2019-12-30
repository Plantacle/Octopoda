import { Module } from '@nestjs/common'

import { MeasurementsModule } from './measurements/measurements.module'
import { MqttToInfluxModule } from './mqtt-to-influx/mqtt-to-influx.module'

@Module({
  imports: [MqttToInfluxModule, MeasurementsModule],
})
export class AppModule {}
