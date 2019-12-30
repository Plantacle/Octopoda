import { ApiProperty } from '@nestjs/swagger'

export class Measurement {
  @ApiProperty({ example: 19.45 })
  temperature: number

  @ApiProperty({ example: 40 })
  humidity: number
}
