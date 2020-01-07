import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { User } from './user.entity'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async newUser(user: User): Promise<User> {
    const userEntity = this.userRepository.create(user)
    return this.userRepository.save(userEntity)
  }

  public async getUserById(id: string): Promise<User> {
    return this.userRepository.findOne(id)
  }

  public async getUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        email: email,
      },
    })
  }
}
