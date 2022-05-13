package at.ac.tuwien.dse.gateway.service;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.Map;

@Data
@Component
@ConfigurationProperties(prefix = "health-check-services")
public class HealthProps {

  private Map<String, String> services;
}
