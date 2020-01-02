import { Module } from '@nestjs/common'

import { MeasurementsController } from './measurements.controller'
import { MeasurementsService } from './measurements.service'

@Module({
  exports: [MeasurementsService],
  providers: [MeasurementsService],
  controllers: [MeasurementsController],
})
export class MeasurementsModule {}
