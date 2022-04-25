package at.ac.dse.simulatorservice.services.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;

/** Feign client to interact with the tracking-service. */
@FeignClient("tracking-service")
public interface TrackingServiceFeign {

  /** Resets the tracking-service to a state where no data is registered. */
  @DeleteMapping("/tracking/all")
  void resetAll();
}
