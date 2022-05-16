package at.ac.dse.simulatorservice.services.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;

/** Feign client to interact with the entity-service. */
@FeignClient(name = "entity-service", url = "http://${services.entity-service}:8889")
public interface EntityServiceFeign {

  /** Resets the entity-serice to a state where no data is registered. */
  @DeleteMapping("/entities/all")
  void resetAll();
}
