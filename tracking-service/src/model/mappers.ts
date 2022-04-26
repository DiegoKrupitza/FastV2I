import type { Car, CarDto } from './car'
import type { TrafficLight, TrafficLightDto } from './traffic-light'

/**
 * Maps a car DTO to a car state.
 * @param car - The car DTO to be mapped.
 * @returns The car state.
 */
function carDtoToCar(car: CarDto): Car {
  return {
    vin: car.vin,
    location: car.location,
    speed: car.speed,
    timestamp: car.timestamp,
  }
}

/**
 * Maps a car state to a car DTO.
 * @param car - The car state to be mapped.
 * @returns The car DTO.
 */
function carToCarDto(car: Car): CarDto {
  return {
    vin: car.vin,
    location: car.location,
    speed: car.speed,
    timestamp: car.timestamp,
  }
}

/**
 * Maps a traffic light DTO to a traffic light state.
 * @param trafficLight - The traffic light DTO to be mapped.
 * @returns The traffic light state.
 */
function trafficLightDtoToTrafficLight(
  trafficLight: TrafficLightDto
): TrafficLight {
  return {
    id: trafficLight.id,
    color: trafficLight.color,
    remainingMilliseconds: trafficLight.remainingMilliseconds,
    timestamp: trafficLight.timestamp,
  }
}

/**
 * Maps a traffic light state to a traffic light DTO.
 * @param trafficLight - The traffic light state to be mapped.
 * @returns The traffic light DTO.
 */
function trafficLightToTrafficLightDto(
  trafficLight: TrafficLight
): TrafficLightDto {
  return {
    id: trafficLight.id,
    color: trafficLight.color,
    remainingMilliseconds: trafficLight.remainingMilliseconds,
    timestamp: trafficLight.timestamp,
  }
}

/**
 * Collection of model mappers.
 */
export const Mappers = {
  carDtoToCar,
  carToCarDto,
  trafficLightDtoToTrafficLight,
  trafficLightToTrafficLightDto,
}
