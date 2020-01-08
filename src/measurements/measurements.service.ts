import { Injectable } from '@nestjs/common'
import { escape as InfluxEscape, FieldType as InfluxFieldType, InfluxDB, IResults, measurement } from 'influx'
import { Measurement } from 'src/measurements/dto/measurement.dto'

@Injectable()
export class MeasurementsService {
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

  public async addMeasurement(deviceId: string, measurements: Measurement): Promise<void> {
    return this.influx.writeMeasurement('sensor_data', [
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
  }

  public async getMeasurements(deviceId: string, hours = 1): Promise<IResults<Measurement>> {
    return this.influx.query<Measurement>(
      `SELECT ROUND(MEAN("temperature")*100)/100 as "temperature",
        ROUND(MEAN("humidity")*10)/10 as "humidity"
        FROM "sensor_data"
        WHERE ("device" = ${InfluxEscape.stringLit(deviceId)})
        AND time > now() - ${hours}h
        GROUP BY time(1m)
        fill(none)`,
    )
  }

  public async getLatestMeasurement(deviceId: string): Promise<Measurement> {
    return (
      await this.influx.query<Measurement>(
        `SELECT LAST("temperature") as "temperature",
        "humidity"
        FROM "sensor_data"
        WHERE ("device" = ${InfluxEscape.stringLit(deviceId)})`,
      )
    )[0]
  }
}
