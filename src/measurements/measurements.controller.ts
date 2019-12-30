import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { MeasurementResult } from './dto/measurement-result.dto'
import { MeasurementsService } from './measurements.service'

@ApiTags('Measurements')
@Controller('measurements')
export class MeasurementsController {
  constructor(private readonly measurementsService: MeasurementsService) {}

  @Get()
  @ApiOkResponse({ type: MeasurementResult, isArray: true })
  public async getMeasurements(): Promise<MeasurementResult[]> {
    return this.measurementsService.getMeasurements('6546710d8bf6bb1a6ad45f81aaf66a4031698825')
  }
}
