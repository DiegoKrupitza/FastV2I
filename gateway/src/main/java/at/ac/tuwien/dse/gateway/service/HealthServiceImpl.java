package at.ac.tuwien.dse.gateway.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.time.temporal.ChronoUnit;

@Service
@Slf4j
public class HealthServiceImpl implements HealthService {

  private RestTemplate customTemplate;

  public HealthServiceImpl() {
    this.customTemplate =
        new RestTemplateBuilder().setConnectTimeout(Duration.of(2, ChronoUnit.SECONDS)).build();
  }

  @Override
  public ServiceDto getHealthStatus(String serviceName, String url) {
    try {
      serviceName = serviceName.toUpperCase();

      ResponseEntity<ServiceStatus> forEntity =
          this.customTemplate.getForEntity(url, ServiceStatus.class);
      if (!forEntity.getStatusCode().is2xxSuccessful()) {
        return new ServiceDto(serviceName, false);
      } else if (forEntity.getBody() == null) {
        return new ServiceDto(serviceName, false);
      } else if (!"UP".equalsIgnoreCase(forEntity.getBody().status())) {
        return new ServiceDto(serviceName, false);
      }
    } catch (Exception e) {
      log.error("We could not communicate with service {} and {} error {}", serviceName, url, e);
      return new ServiceDto(serviceName, false);
    }
    return new ServiceDto(serviceName, true);
  }
}
