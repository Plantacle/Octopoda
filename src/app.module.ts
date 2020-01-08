import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AuthModule } from './auth/auth.module'
import { MeasurementsModule } from './measurements/measurements.module'
import { MqttToInfluxModule } from './mqtt-to-influx/mqtt-to-influx.module'
import { User } from './users/user.entity'
import { UsersModule } from './users/users.module'
import { DeviceModule } from './device/device.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb://localhost:27017/octopoda',
      keepConnectionAlive: true,
      entities: [User],
      synchronize: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      appname: 'octopoda',
    }),
    MqttToInfluxModule,
    MeasurementsModule,
    UsersModule,
    AuthModule,
    DeviceModule,
  ],
})
export class AppModule {}
