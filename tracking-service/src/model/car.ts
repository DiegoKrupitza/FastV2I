import type { Document } from 'mongodb'

export interface Car extends Document {
  vin: string
  location: number
  speed: number
  timestamp: number
}

export interface CarDto {
  vin: string
  location: number
  speed: number
  timestamp: number
}
