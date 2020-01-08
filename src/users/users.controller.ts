import { BadRequestException, Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { ReqUser } from 'src/common/decorators/req-user.decorator'

import { User } from './user.entity'
import { UsersService } from './users.service'

@Controller('users')
@ApiTags('Users')
@ApiBadRequestResponse({ description: 'Error that is resolvable user side' })
@ApiInternalServerErrorResponse({ description: 'Server error that is not resolvable user side' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get info of authenticated user' })
  @ApiOkResponse({ description: 'User info', type: User })
  public async getUser(@ReqUser() user: User): Promise<User> {
    return user
  }

  @Post()
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({ description: 'User registered successfully', type: User })
  public async addUser(@Body() user: User): Promise<Omit<User, 'password'>> {
    user.roles = ['user']
    try {
      const newUser = await this.usersService.updateOrCreateUser(user)
      delete newUser.password
      return newUser
    } catch (error) {
      if (error.code && error.code === 11000) {
        throw new BadRequestException('Email already in use', 'EmailInUseError')
      } else {
        throw error
      }
    }
  }
}
