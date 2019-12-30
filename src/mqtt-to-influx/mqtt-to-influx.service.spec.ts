import { Test, TestingModule } from '@nestjs/testing'

import { MqttToInfluxService } from './mqtt-to-influx.service'

describe('MqttToInfluxService', () => {
  let service: MqttToInfluxService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MqttToInfluxService],
    }).compile()

    service = module.get<MqttToInfluxService>(MqttToInfluxService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
