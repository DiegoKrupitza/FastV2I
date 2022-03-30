import type { Document } from 'mongodb'

export interface TrafficLight extends Document {
  id: string
  location: GeoJSON.Point
}
