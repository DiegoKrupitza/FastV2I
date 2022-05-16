package at.ac.tuwien.dse.flowcontrolservice.service;

import at.ac.tuwien.dse.flowcontrolservice.dto.NearestTrafficLightStateDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/** Feign client to interact with the tracking-service. */
@FeignClient(value = "tracking-service", url = "http://${services.tracking-service}:8888")
public interface TrackingServiceFeign {

  /** Resets the tracking-service to a state where no data is registered. */
  @DeleteMapping("/tracking/all")
  void resetAll();

  /**
   * Gets the state of a traffic light identified by its id.
   *
   * @param id the id of the traffic light.
   */
  @GetMapping("/tracking/traffic-lights/{id}/latest")
  NearestTrafficLightStateDto getNearestTrafficLightState(@PathVariable String id);
}
