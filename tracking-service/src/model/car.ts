import type { Document } from 'mongodb'

export interface Car extends Document {
  vin: string
  location: GeoJSON.Point
  speed: number
  timestamp: number
}
