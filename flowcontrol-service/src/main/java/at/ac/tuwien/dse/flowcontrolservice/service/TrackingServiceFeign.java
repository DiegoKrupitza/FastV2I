package at.ac.tuwien.dse.flowcontrolservice.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;

@FeignClient("tracking-service")
public interface TrackingServiceFeign {

  @DeleteMapping("/tracking/all")
  void resetAll();
}
