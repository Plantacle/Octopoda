import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common'
import Aedes from 'aedes'
import { FieldType as InfluxFieldType, InfluxDB } from 'influx'
import Net from 'net'

import { Measurements } from './mqtt-to-influx.interfaces'

@Injectable()
export class MqttToInfluxService implements OnModuleInit, OnModuleDestroy {
  public onModuleInit(): void {
    this.startMqttServer()
    this.subscribe()
  }
  public onModuleDestroy(): void {
    this.stopMqttServer()
  }

  private readonly logger = new Logger(MqttToInfluxService.name, true)
  private mqtt = Aedes()
  private mqttServer = Net.createServer(this.mqtt.handle)
  private influx = new InfluxDB({
    host: 'localhost',
    database: 'testdata',
    schema: [
      {
        measurement: 'sensor_data',
        fields: {
          temperature: InfluxFieldType.FLOAT,
          humidity: InfluxFieldType.FLOAT,
        },
        tags: ['device'],
      },
    ],
  })

  private startMqttServer(): void {
    this.mqttServer.listen(1883, () => {
      this.logger.log('MQTT server listening on port 1883')
    })
  }

  private stopMqttServer(): void {
    this.mqttServer.close()
  }

  private subscribe(): void {
    this.mqtt.subscribe(
      '/plantacle/#',
      (packet: any, next) => {
        let measurements: Measurements
        try {
          measurements = JSON.parse(packet.payload.toString())
        } catch (error) {
          return
        }
        const deviceId = packet.topic.substring('/plantacle/'.length)
        // console.log(deviceId);
        // console.log(measurements.temperature);
        this.influx.writeMeasurement('sensor_data', [
          {
            tags: {
              device: deviceId,
            },
            fields: {
              temperature: measurements.temperature,
              humidity: measurements.humidity,
            },
          },
        ])
        next()
      },
      () => {
        this.logger.log('subscribed to /plantacle/#')
      },
    )
  }
}
