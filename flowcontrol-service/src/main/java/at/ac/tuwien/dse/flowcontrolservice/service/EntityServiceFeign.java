package at.ac.tuwien.dse.flowcontrolservice.service;

import at.ac.tuwien.dse.flowcontrolservice.dto.NearestTrafficLightDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Optional;

@FeignClient(name = "entity-service")
public interface EntityServiceFeign {

  @DeleteMapping("/entities/all")
  void resetAll();

  @GetMapping("/entities/traffic-lights/near/{location}/{direction}")
  Optional<NearestTrafficLightDto> getNearestTrafficLight(
      @PathVariable("location") Long location, @PathVariable("direction") String direction);
}
