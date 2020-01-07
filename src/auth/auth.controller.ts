import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { ReqUser } from 'src/common/decorators/req-user.decorator'
import { User } from 'src/users/user.entity'

import { AuthService } from './auth.service'
import { AccessTokenDto } from './dto/access-token.dto'
import { LoginDto } from './dto/login.dto'

@Controller('auth')
@ApiTags('Authentication')
@ApiBadRequestResponse({ description: 'Error that is resolvable user side' })
@ApiInternalServerErrorResponse({ description: 'Server error that is not resolvable user side' })
export class AuthController {
  public constructor(private readonly authService: AuthService) {}
  @Post()
  @ApiOperation({ summary: 'Create an access token' })
  @UseGuards(AuthGuard('local'))
  @ApiCreatedResponse({ description: 'Login successful', type: AccessTokenDto })
  @ApiUnauthorizedResponse({ description: 'Invalid email or password' })
  public async login(@ReqUser() user: User, @Body() loginDto: LoginDto): Promise<AccessTokenDto> {
    return this.authService.getAccessToken(user, loginDto.rememberMe)
  }
}
