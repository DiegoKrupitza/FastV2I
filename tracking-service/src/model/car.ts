import type { Document } from 'mongodb'

/**
 * Model of a car state.
 */
export interface Car extends Document {
  /** The VIN of the car. */
  vin: string
  /** The location of the car in meters. */
  location: number
  /** The speed of the car in m/s. */
  speed: number
  /** The timestamp of the state change. */
  timestamp: string
}

/**
 * Model of a car state DTO.
 */
export interface CarDto {
  /** The VIN of the car. */
  vin: string
  /** The location of the car in meters. */
  location: number
  /** The location of the car in meters. */
  speed: number
  /** The timestamp of the state change. */
  timestamp: string
}
