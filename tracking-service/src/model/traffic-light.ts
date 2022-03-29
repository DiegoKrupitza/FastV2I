import { Document } from 'mongodb'

export interface TrafficLightState {
  color: 'green' | 'red'
  remainingMilliseconds: number
}

export interface TrafficLight extends Document {
  state: TrafficLightState
}
