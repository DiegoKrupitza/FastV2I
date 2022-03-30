import type { Document } from 'mongodb'

export interface TrafficLight extends Document {
  location: GeoJSON.Point
}

export interface TrafficLightDto {
  id: string
  location: number[]
}
