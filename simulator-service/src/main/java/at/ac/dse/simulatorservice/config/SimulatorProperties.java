package at.ac.dse.simulatorservice.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties("simulator")
@Data
public class SimulatorProperties {

  private Long minScanLength;
  private Long maxNumberOfLights;
  private Long minCarSpeed;
  private Long maxCarSpeed;

  private String carStateMom;
  private String trafficLightStateMom;
  private String carMom;
  private String trafficLightMom;
}
