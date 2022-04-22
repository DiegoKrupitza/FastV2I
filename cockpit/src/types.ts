import type { ViteSSGContext } from 'vite-ssg'

export type UserModule = (ctx: ViteSSGContext) => void

export interface Simulation {
  /** Length in meters. */
  scenarioLength: number
  timelapse: boolean
}

export interface CarEntity {
  vin: string
  oem: string
  model: string
}

export interface CarState {
  vin: string
  timestamp: string
}

export type Car = CarEntity & CarState

export interface TrafficLightEntity {
  id: string
  location: [number, number]
}

export interface TrafficLightState {
  id: string
  color: 'green' | 'red'
  timestamp: string
}

export type TrafficLight = TrafficLightEntity & TrafficLightState
