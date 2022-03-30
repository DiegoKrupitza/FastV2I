import type { Document } from 'mongodb'

export interface Car extends Document {
  vin: string
  oem: string
  model: string
}
