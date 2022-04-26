import type { Document } from 'mongodb'
/**
 * Model of a car entity.
 */
export interface Car extends Document {
  /** The OEM of the car. */
  oem: string
  /** The model of the car. */
  model: string
}

/**
 * Model of a car DTO.
 */
export interface CarDto {
  /** The VIN of the car. */
  vin: string
  /** The OEM of the car. */
  oem: string
  /** The model of the car. */
  model: string
}
