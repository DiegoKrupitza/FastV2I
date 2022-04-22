import type { Car, CarDto } from './car'
import type { TrafficLight, TrafficLightDto } from './traffic-light'

function carDtoToCar(car: CarDto): Car {
  return {
    vin: car.vin,
    location: car.location,
    speed: car.speed,
    timestamp: car.timestamp,
  }
}

function carToCarDto(car: Car): CarDto {
  return {
    vin: car.vin,
    location: car.location,
    speed: car.speed,
    timestamp: car.timestamp,
  }
}

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

export const Mappers = {
  carDtoToCar,
  carToCarDto,
  trafficLightDtoToTrafficLight,
  trafficLightToTrafficLightDto,
}
