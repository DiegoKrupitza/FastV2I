import type { Document } from 'mongodb'

export interface TrafficLight extends Document {
  scanDistance: number
  location: GeoJSON.Point
}

export interface TrafficLightDto {
  id: string
  scanDistance: number
  location: number[]
}
