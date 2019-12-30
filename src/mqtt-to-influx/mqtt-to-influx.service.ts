import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import Aedes from 'aedes'
import Net from 'net'
import { MeasurementsService } from 'src/measurements/measurements.service'

import { Measurement } from './mqtt-to-influx.interfaces'

@Injectable()
export class MqttToInfluxService implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly sensorDataService: MeasurementsService) {}
  public onModuleInit(): void {
    this.startMqttServer()
    this.subscribe()
  }
  public onModuleDestroy(): void {
    this.mqtt.close()
    this.mqttServer.close()
  }

  private readonly logger = new Logger(MqttToInfluxService.name, true)
  private mqtt = Aedes({})
  private mqttServer = Net.createServer(this.mqtt.handle)

  private startMqttServer(): void {
    this.mqttServer.listen(1883, () => {
      this.logger.log('MQTT server listening on port 1883')
    })
  }

  private subscribe(): void {
    this.mqtt.subscribe(
      '/plantacle/#',
      (packet: any, next) => {
        let measurement: Measurement
        try {
          measurement = JSON.parse(packet.payload.toString())
        } catch (error) {
          return
        }
        const deviceId = packet.topic.substring('/plantacle/'.length)

        this.sensorDataService.addMeasurement(deviceId, measurement)
        next()
      },
      () => {
        this.logger.log('subscribed to /plantacle/#')
      },
    )
  }
}
