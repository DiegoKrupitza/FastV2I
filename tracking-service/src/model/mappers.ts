import type { ObjectId } from 'mongodb'

import type { Car, CarDto } from './car'
import type { TrafficLight, TrafficLightDto } from './traffic-light'

function carDtoToCar(car: CarDto): Car {
  return {
    _id: car.vin as unknown as ObjectId,
    location: {
      type: 'Point',
      coordinates: car.location,
    },
    speed: car.speed,
    timestamp: car.timestamp,
  }
}

function carToCarDto(car: Car): CarDto {
  return {
    vin: car._id,
    location: car.location.coordinates,
    speed: car.speed,
    timestamp: car.timestamp,
  }
}

function trafficLightDtoToTrafficLight(
  trafficLight: TrafficLightDto
): TrafficLight {
  return {
    _id: trafficLight.id as unknown as ObjectId,
    color: trafficLight.color,
    remainingMilliseconds: trafficLight.remainingMilliseconds,
    timestamp: trafficLight.timestamp,
  }
}

function trafficLightToTrafficLightDto(
  trafficLight: TrafficLight
): TrafficLightDto {
  return {
    id: trafficLight._id,
    color: trafficLight.color,
    remainingMilliseconds: trafficLight.remainingMilliseconds,
    timestamp: trafficLight.timestamp,
  }
}

export const Mappers = {
  carDtoToCar,
  carToCarDto,
  trafficLightDtoToTrafficLight,
  trafficLightToTrafficLightDto,
}
