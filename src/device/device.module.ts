import { Module } from '@nestjs/common'
import { UsersModule } from 'src/users/users.module'

import { DeviceController } from './device.controller'

@Module({
  controllers: [DeviceController],
  imports: [UsersModule],
})
export class DeviceModule {}
