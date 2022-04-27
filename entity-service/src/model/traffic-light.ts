import type { Document } from 'mongodb'

/**
 * The model of a traffic light entity.
 */
export interface TrafficLight extends Document {
  /** The scan distance of the traffic light in meters. */
  scanDistance: number
  /** The location of the traffic light in meters. */
  location: number
}

/**
 * The model of a traffic light DTO.
 */
export interface TrafficLightDto {
  /** The id of the traffic light. */
  id: string
  /** The scan distance of the traffic light in meters. */
  scanDistance: number
  /** The location of the traffic light in meters. */
  location: number
}
