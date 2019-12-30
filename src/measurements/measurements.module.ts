import { Module } from '@nestjs/common'

import { MeasurementsService } from './measurements.service'

@Module({
  exports: [MeasurementsService],
  providers: [MeasurementsService],
})
export class MeasurementsModule {}
