import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UsersService } from 'src/users/users.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  public constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // TODO: use config for secret
      secretOrKey: 'secret',
    })
  }

  public async validate(payload: any): Promise<object | false> {
    const user = await this.usersService.getUserById(payload.sub)
    if (user) {
      delete user.password
      return user
    } else {
      return null
    }
  }
}
