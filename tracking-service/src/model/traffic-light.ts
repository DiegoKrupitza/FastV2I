import type { Document } from 'mongodb'

export interface TrafficLight extends Document {
  id: string
  color: 'green' | 'red'
  remainingMilliseconds: number
  timestamp: number
}
