import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'

import { User } from './user.entity'
import { UsersService } from './users.service'

@Controller('users')
@ApiTags('Users')
@ApiBadRequestResponse({ description: 'Error that is resolvable user side' })
@ApiInternalServerErrorResponse({ description: 'Server error that is not resolvable user side' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Register a new user',
  })
  @ApiCreatedResponse({
    description: 'User registered successfully',
    type: User,
  })
  public async adduser(@Body() user: User): Promise<Omit<User, 'password'>> {
    user.roles = ['user']
    try {
      const newUser = await this.usersService.newUser(user)
      delete newUser.password
      return newUser
    } catch (error) {
      if (error.code && error.code === 11000) {
        throw new BadRequestException('Username already in use', 'UsernameInUseError')
      } else {
        throw error
      }
    }
  }
}
