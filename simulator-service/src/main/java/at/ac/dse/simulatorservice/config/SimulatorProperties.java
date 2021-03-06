package at.ac.dse.simulatorservice.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/** Holds the configuration properties of the simulator service */
@Configuration
@ConfigurationProperties("simulator")
@Data
public class SimulatorProperties {

  private Long minScanLength;
  private Long maxNumberOfLights;
  private Long minCarSpeed;
  private Long maxCarSpeed;

  private String carStateTrackingMom;
  private String carStateFlowMom;

  private String trafficLightStateMom;
  private String carMom;
  private String speedMom;
  private String trafficLightMom;

  private Long timelapseDivider;

  private String fanoutName;
}
