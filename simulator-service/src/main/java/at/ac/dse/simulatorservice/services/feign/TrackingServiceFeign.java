package at.ac.dse.simulatorservice.services.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;

/** Feign client to interact with the tracking-service. */
@FeignClient(value = "tracking-service", url = "http://tracking-service:8888")
public interface TrackingServiceFeign {

  /** Resets the tracking-service to a state where no data is registered. */
  @DeleteMapping("/tracking/all")
  void resetAll();
}
