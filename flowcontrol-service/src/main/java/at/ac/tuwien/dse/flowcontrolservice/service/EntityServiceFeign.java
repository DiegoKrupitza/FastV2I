package at.ac.tuwien.dse.flowcontrolservice.service;

import at.ac.tuwien.dse.flowcontrolservice.dto.NearestTrafficLightDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Optional;

/** Feign client to interact with the entity-service. */
@FeignClient(name = "entity-service", url = "http://entity-service:8889")
public interface EntityServiceFeign {

  /** Resets the entity-serice to a state where no data is registered. */
  @DeleteMapping("/entities/all")
  void resetAll();

  /**
   * Gets the nearest traffic light from a given position considering the direction we are looking.
   *
   * @param location the location from where the nearest location should be calculated.
   * @param direction the direction we are looking
   * @return the nearest traffic light. If there is no nearest traffic light the return value is
   *     {@code Optional.EMPTY}
   */
  @GetMapping("/entities/traffic-lights/near/{location}/{direction}")
  Optional<NearestTrafficLightDto> getNearestTrafficLight(
      @PathVariable("location") Long location, @PathVariable("direction") String direction);
}
