package at.ac.tuwien.dse.flowcontrolservice.service;

import at.ac.tuwien.dse.flowcontrolservice.config.FlowControlProperties;
import at.ac.tuwien.dse.flowcontrolservice.dto.CarStateDto;
import at.ac.tuwien.dse.flowcontrolservice.dto.NearestTrafficLightDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FlowControlService {

  private final FlowControlProperties flowControlProperties;
  private final EntityServiceFeign entityServiceFeign;

  /**
   * Calculates the perfect speed for the car to drive
   *
   * @param car the car
   * @return the perfect speed
   */
  public Long getAdvisedSpeed(CarStateDto car) {
    Optional<NearestTrafficLightDto> nearestTrafficLight =
        entityServiceFeign.getNearestTrafficLight(car.location(), car.directionCode());

    if (nearestTrafficLight.isEmpty() || isCarNotInScanDistance(car,nearestTrafficLight.get())) {
      return car.speed();
    }

    // request an tracking service um remaining time und state von ampel zu kriegen (über feign)
    // wenn ampel rot und auto und ampel location  dann 0 speed

    // TODO: logic für fancy stuff

    return car.speed();
  }

  private boolean isCarNotInScanDistance(CarStateDto car, NearestTrafficLightDto nearestTrafficLight) {
    if (car.directionCode().equals("NTS") && car.location() > (nearestTrafficLight.location()) + nearestTrafficLight.scanDistance())
      return true;
    return car.directionCode().equals("STN") && car.location() < (nearestTrafficLight.location()) - nearestTrafficLight.scanDistance();
  }

}
