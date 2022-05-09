import type { Document } from 'mongodb'

/**
 * The model of a traffic light state.
 */
export interface TrafficLight extends Document {
  /** The id of the traffic light. */
  id: string
  /** The color of the traffic light. */
  color: 'green' | 'red'
  /** The milliseconds until the next state change. */
  remainingMilliseconds: number
  /** The timestamp of the state change. */
  timestamp: string
}

/**
 * The model of a traffic light state DTO.
 */
export interface TrafficLightDto {
  /** The id of the traffic light. */
  id: string
  /** The color of the traffic light. */
  color: 'green' | 'red'
  /** The milliseconds until the next state change. */
  remainingMilliseconds: number
  /** The timestamp of the state change. */
  timestamp: string
}
