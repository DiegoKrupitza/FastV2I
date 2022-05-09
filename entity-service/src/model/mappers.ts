import type { ObjectId } from 'mongodb'

import type { Car, CarDto } from './car'
import type { TrafficLight, TrafficLightDto } from './traffic-light'

/**
 * Maps a car DTO to a car entity.
 * @param car - The car DTO to be mapped.
 * @returns The car entity.
 */
function carDtoToCar(car: CarDto): Car {
  return {
    _id: car.vin as unknown as ObjectId,
    oem: car.oem,
    model: car.model,
    goingUp: car.goingUp,
  }
}

/**
 * Maps a car to a car DTO.
 * @param car - The car to be mapped.
 * @returns The car DTO.
 */
function carToCarDto(car: Car): CarDto {
  return {
    vin: car._id,
    oem: car.oem,
    model: car.model,
    goingUp: car.goingUp,
  }
}

/**
 * Maps a traffic light DTO to a traffic light entity.
 * @param trafficLight - The traffic light DTO to be mapped.
 * @returns The traffic light entity.
 */
function trafficLightDtoToTrafficLight(
  trafficLight: TrafficLightDto
): TrafficLight {
  return {
    _id: trafficLight.id as unknown as ObjectId,
    scanDistance: trafficLight.scanDistance,
    location: trafficLight.location,
  }
}

/**
 * Maps a traffic light to a traffic light DTO.
 * @param trafficLight - The traffic light to be mapped.
 * @returns The traffic light DTO.
 */
function trafficLightToTrafficLightDto(
  trafficLight: TrafficLight
): TrafficLightDto {
  return {
    id: trafficLight._id,
    scanDistance: trafficLight.scanDistance,
    location: trafficLight.location,
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
