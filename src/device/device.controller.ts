import { Body, Controller, Delete, Get, Put, UseGuards } from '@nestjs/common'
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
import { ReqUser } from 'src/common/decorators/req-user.decorator'
import { User } from 'src/users/user.entity'
import { UsersService } from 'src/users/users.service'

import { UpdateDeviceDto } from './dto/update-device.dto'

@Controller('device')
@ApiTags('Device')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Invalid or expired token' })
@ApiBadRequestResponse({ description: 'Error that is resolvable user side' })
@ApiInternalServerErrorResponse({ description: 'Server error that is not resolvable user side' })
export class DeviceController {
  constructor(private readonly usersService: UsersService) {}

  @Put()
  @ApiOperation({ summary: 'Update device id associated with user' })
  @ApiOkResponse({ type: User })
  public async postDevice(@Body() body: UpdateDeviceDto, @ReqUser() user: User): Promise<User> {
    return this.usersService.updateDevice(user, body.deviceId)
  }

  @Delete()
  @ApiOperation({ summary: 'Delete associated device from user' })
  @ApiOkResponse({ type: User })
  public async deleteDevice(@ReqUser() user: User): Promise<User> {
    return this.usersService.deleteDevice(user)
  }
}
