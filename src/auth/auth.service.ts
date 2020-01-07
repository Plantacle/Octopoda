import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import Bcrypt from 'bcrypt'
import { User } from 'src/users/user.entity'

import { UsersService } from '../users/users.service'
import { AccessTokenDto } from './dto/access-token.dto'

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

  public async validateUser(email: string, password: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.getUserByEmail(email)
    if (user && (await Bcrypt.compare(password, user.password))) {
      delete user.password
      return user
    } else {
      return null
    }
  }

  public async getAccessToken(user: User, rememberMe = false): Promise<AccessTokenDto> {
    const payload = { sub: user._id }
    const expireHours = rememberMe ? 7 * 24 : 8
    const expireDate = new Date()
    expireDate.setHours(expireDate.getHours() + expireHours)
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: `${expireHours}h` }),
      expires: expireDate,
    }
  }
}
