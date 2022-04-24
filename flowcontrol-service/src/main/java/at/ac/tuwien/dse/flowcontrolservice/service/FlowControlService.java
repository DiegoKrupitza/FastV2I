package at.ac.tuwien.dse.flowcontrolservice.service;

import at.ac.tuwien.dse.flowcontrolservice.config.FlowControlProperties;
import at.ac.tuwien.dse.flowcontrolservice.dto.CarStateDto;
import at.ac.tuwien.dse.flowcontrolservice.dto.NearestTrafficLightDto;
import at.ac.tuwien.dse.flowcontrolservice.dto.NearestTrafficLightStateDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class FlowControlService {

  private final FlowControlProperties flowControlProperties;
  private final EntityServiceFeign entityServiceFeign;
  private final TrackingServiceFeign trackingServiceFeign;

  /**
   * Calculates the perfect speed for the car to drive
   *
   * @param car the car
   * @return the perfect speed
   */
  public Long getAdvisedSpeed(CarStateDto car) {
    Optional<NearestTrafficLightDto> nearestTrafficLight =
        entityServiceFeign.getNearestTrafficLight(car.location(), car.directionCode());

    if (nearestTrafficLight.isEmpty()) {
      return car.speed();
    }
    String trafficLightId = nearestTrafficLight.get().id();
    NearestTrafficLightStateDto nearestTrafficLightState = trackingServiceFeign.getNearestTrafficLightState(trafficLightId);
    double remainingTimeInSeconds = nearestTrafficLightState.remainingMilliseconds()/1000.0;
    double distance = Math.abs(car.location()-nearestTrafficLight.get().location());
    String trafficLightState = nearestTrafficLightState.color();

    long speed = car.speed();
    // < maxCarSpeed because one tick is maxCarSpeed meters
    if (distance < flowControlProperties.getMaxCarSpeed() && trafficLightState.equals("red")){
      speed = 0L;
    }
    else if (trafficLightState.equals("green")){
      speed = calculateCarSpeedGreenTrafficLight(car, remainingTimeInSeconds, distance);
    }
    else if (trafficLightState.equals("red")){
      speed = calculateCarSpeedRedTrafficLight(car, remainingTimeInSeconds, distance);
    }

    return speed;
  }

  private long calculateCarSpeedRedTrafficLight(CarStateDto car, double remainingTimeInSeconds, double distance) {
    long speed;
    long speedNeeded = (long) ((distance -10)/ remainingTimeInSeconds); // -10 so you do not cross the red traffic light
    if (speedNeeded < car.speed()) {
      speed = speedNeeded > flowControlProperties.getMinCarSpeed() ? speedNeeded : flowControlProperties.getMinCarSpeed();
    }
    else if (speedNeeded > flowControlProperties.getMaxCarSpeed()) // will not reach traffic light before state change
      speed = flowControlProperties.getMaxCarSpeed();
    else
      speed = speedNeeded;
    return speed;
  }

  private long calculateCarSpeedGreenTrafficLight(CarStateDto car, double remainingTimeInSeconds, double distance) {
    long speed;
    long speedNeeded = (long) ((distance +10)/ remainingTimeInSeconds); // +10 so you arrive at traffic light when it is still green
    if (speedNeeded < car.speed())
      speed = car.speed();
    else if (speedNeeded > flowControlProperties.getMaxCarSpeed()) // will not reach traffic light before state change
      speed = flowControlProperties.getMinCarSpeed();
    else if (car.speed() == 0)
      speed = flowControlProperties.getMaxCarSpeed();
    else
      speed = speedNeeded;
    return speed;
  }




}
