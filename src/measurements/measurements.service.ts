import { Injectable } from '@nestjs/common'
import { escape as InfluxEscape, FieldType as InfluxFieldType, InfluxDB, IResults } from 'influx'
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

  public async getMeasurements(deviceId: string, duration = '1h'): Promise<IResults<Measurement>> {
    try {
      return this.influx.query<Measurement>(
        `SELECT ROUND(MEAN("temperature")*100)/100 as "temperature",
        ROUND(MEAN("humidity")*10)/10 as "humidity"
        FROM "sensor_data"
        WHERE ("device" = ${InfluxEscape.stringLit(deviceId)})
        AND time > now() - ${duration}
        GROUP BY time(1m)
        fill(none)`,
      )
    } catch (error) {
      console.log(error)
    }
  }
}
