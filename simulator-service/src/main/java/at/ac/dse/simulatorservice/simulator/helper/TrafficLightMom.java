package at.ac.dse.simulatorservice.simulator.helper;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class TrafficLightMom {

  private final String id;
  private final Long scanDistance;
  private final Long[] location;
}
