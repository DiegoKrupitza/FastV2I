package at.ac.tuwien.dse.flowcontrolservice.service;

import at.ac.tuwien.dse.flowcontrolservice.dto.NearestTrafficLightStateDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient("tracking-service")
public interface TrackingServiceFeign {

  @DeleteMapping("/tracking/all")
  void resetAll();

  @GetMapping("/tracking/traffic-lights/{id}/latest")
  NearestTrafficLightStateDto getNearestTrafficLightState(@PathVariable String id);
}
