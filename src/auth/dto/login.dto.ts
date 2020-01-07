import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class LoginDto {
  @ApiProperty({ example: 'johndoe@example.com', description: 'email of the user you want to login as' })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  public email: string

  @ApiProperty({ example: 'supersecret', description: 'Password of the user you want to login as' })
  @IsNotEmpty()
  @IsString()
  public password: string

  @ApiPropertyOptional({ example: false, description: 'Makes the token have a longer expiry time' })
  @IsOptional()
  @IsBoolean()
  public rememberMe?: boolean
}
