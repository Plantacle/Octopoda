import { Controller, Get, NotFoundException, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { ReqUser } from 'src/common/decorators/req-user.decorator'
import { User } from 'src/users/user.entity'

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
  @ApiNotFoundResponse({ description: 'No device added to this user' })
  public async getMeasurements(@ReqUser() user: User): Promise<MeasurementResult[]> {
    if (user.deviceId) {
      return this.measurementsService.getMeasurements(user.deviceId)
    } else {
      throw new NotFoundException('No device added to this user yet', 'NoDeviceError')
    }
  }
}
