import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class UpdateDeviceDto {
  @ApiProperty({ example: '6546710d8bf6bb1a6ad45f81aaf66a4031698825' })
  @IsString()
  @IsNotEmpty()
  deviceId: string
}
