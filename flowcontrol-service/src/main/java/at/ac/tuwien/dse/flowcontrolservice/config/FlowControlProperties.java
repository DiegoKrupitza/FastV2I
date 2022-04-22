package at.ac.tuwien.dse.flowcontrolservice.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties("flowcontrol")
@Data
public class FlowControlProperties {

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
