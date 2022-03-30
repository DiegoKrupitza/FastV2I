import type { Document } from 'mongodb'

export interface Car extends Document {
  oem: string
  model: string
}

export interface CarDto {
  vin: string
  oem: string
  model: string
}
