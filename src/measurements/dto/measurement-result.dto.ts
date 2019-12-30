import { ApiProperty } from '@nestjs/swagger'

import { Measurement } from './measurement.dto'

export class MeasurementResult extends Measurement {
  @ApiProperty({ example: '2019-12-30T21:20:00.000Z', type: String })
  time?: Date
}
