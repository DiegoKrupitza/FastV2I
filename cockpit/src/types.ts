import type { ViteSSGContext } from 'vite-ssg'

export type UserModule = (ctx: ViteSSGContext) => void

export interface Simulation {
  id: string
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
  location: number
  speed: number
  timestamp: string
}

export type Car = CarEntity & CarState

export interface NewCar {
  vin: string
  oem: string
  model: string
  entryTime: number
  speed: number
  location: number
  destination: number
}

export interface TrafficLightEntity {
  id: string
  location: number
  scanDistance: number
}

export interface TrafficLightState {
  id: string
  color: 'green' | 'red'
  remainingMilliseconds: number
  timestamp: string
}

export type TrafficLight = TrafficLightEntity & TrafficLightState

export interface NewTrafficLight {
  id: string
  /** Position in meters. */
  position: number
  /** Scan distance in meters. */
  scanDistance: number
  /** Delay of initial state change in milliseconds. */
  entryDelay: number
  /** Interval of state changes in seconds. */
  stateHoldSeconds: number
}

export interface NewSimulation {
  id: string
  cars: NewCar[]
  /** Scenario length in meters */
  scenarioLength: number
  timelapse: boolean
  trafficLights: NewTrafficLight[]
}
