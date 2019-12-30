export interface Packet {
  cmd: string
  brokerId: string
  brokerCounter: number
  topic: string
  payload: Buffer
  qos: number
  retain: boolean
  messageId: number
}

export interface Measurements {
  temperature: number
  humidity: number
}
