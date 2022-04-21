package at.ac.dse.simulatorservice.services.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;

@FeignClient(name = "entity-service")
public interface EntityServiceFeign {

  @DeleteMapping("/entities/all")
  void resetAll();
}
