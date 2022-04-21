package at.ac.dse.simulatorservice.services.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;

@FeignClient("tracking-service")
public interface TrackingServiceFeign {

  @DeleteMapping("/tracking/all")
  void resetAll();
}