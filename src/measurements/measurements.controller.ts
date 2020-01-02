import { Controller, Get, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

import { MeasurementResult } from './dto/measurement-result.dto'
import { MeasurementsService } from './measurements.service'

@ApiTags('Measurements')
@Controller('measurements')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Invalid or expired token' })
@ApiBadRequestResponse({ description: 'Error that is resolvable user side' })
@ApiInternalServerErrorResponse({ description: 'Server error that is not resolvable user side' })
export class MeasurementsController {
  constructor(private readonly measurementsService: MeasurementsService) {}

  @Get()
  @ApiOperation({ summary: 'Get measurements of the last hour, grouped per minute' })
  @ApiOkResponse({ type: MeasurementResult, isArray: true })
  public async getMeasurements(): Promise<MeasurementResult[]> {
    return this.measurementsService.getMeasurements('6546710d8bf6bb1a6ad45f81aaf66a4031698825')
  }
}
