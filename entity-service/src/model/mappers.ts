import type { ObjectId } from 'mongodb'

import type { Car, CarDto } from './car'
import type { TrafficLight, TrafficLightDto } from './traffic-light'

function carDtoToCar(car: CarDto): Car {
  return {
    _id: car.vin as unknown as ObjectId,
    oem: car.oem,
    model: car.model,
  }
}

function carToCarDto(car: Car): CarDto {
  return {
    vin: car._id,
    oem: car.oem,
    model: car.model,
  }
}

function trafficLightDtoToTrafficLight(
  trafficLight: TrafficLightDto
): TrafficLight {
  return {
    _id: trafficLight.id as unknown as ObjectId,
    scanDistance: trafficLight.scanDistance,
    location: {
      type: 'Point',
      coordinates: trafficLight.location,
    },
  }
}

function trafficLightToTrafficLightDto(
  trafficLight: TrafficLight
): TrafficLightDto {
  return {
    id: trafficLight._id,
    scanDistance: trafficLight.scanDistance,
    location: trafficLight.location.coordinates,
  }
}

export const Mappers = {
  carDtoToCar,
  carToCarDto,
  trafficLightDtoToTrafficLight,
  trafficLightToTrafficLightDto,
}
