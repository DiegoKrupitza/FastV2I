import type { Document } from 'mongodb'

export interface TrafficLight extends Document {
  color: 'green' | 'red'
  remainingMilliseconds: number
  timestamp: number
}

export interface TrafficLightDto {
  id: string
  color: 'green' | 'red'
  remainingMilliseconds: number
  timestamp: number
}
