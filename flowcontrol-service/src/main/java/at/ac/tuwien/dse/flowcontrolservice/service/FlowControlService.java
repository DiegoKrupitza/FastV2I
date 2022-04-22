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
        entityServiceFeign.getNearestTrafficLight(car.location()[0], car.directionCode());

    if (nearestTrafficLight.isEmpty()) {
      return car.speed();
    }

    // TODO: logic für fancy stuff

    return car.speed();
  }
}
