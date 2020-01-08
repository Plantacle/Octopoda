import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MongoRepository } from 'typeorm'

import { User } from './user.entity'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
  ) {}

  public async updateOrCreateUser(user: User): Promise<User> {
    const userEntity = this.userRepository.create(user)
    return this.userRepository.save(userEntity)
  }

  public async updateDevice(user: User, deviceId: string): Promise<User> {
    if (user._id) {
      user.deviceId = deviceId
      return this.updateOrCreateUser(user)
    }
  }

  public async deleteDevice(user: User): Promise<User> {
    if (user._id) {
      const result = await this.userRepository.updateOne(
        {
          _id: user._id,
        },
        {
          $unset: {
            deviceId: true,
          },
        },
      )
      if (result.result.ok === 1) {
        delete user.deviceId
      }
      return user
    }
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
