package at.ac.dse.simulatorservice.simulator.mapper;

import at.ac.dse.simulatorservice.domain.TrafficLight;
import at.ac.dse.simulatorservice.simulator.domain.ColorState;
import at.ac.dse.simulatorservice.simulator.domain.TrafficLightMom;
import at.ac.dse.simulatorservice.simulator.domain.TrafficLightStateMom;

import java.time.LocalDateTime;

public abstract class TrafficLightMapper {

  public static TrafficLightMom toTrafficLightMom(TrafficLight trafficLight) {
    return new TrafficLightMom(
        trafficLight.getId(), //
        trafficLight.getScanDistance(), //
        new Long[] {trafficLight.getPosition(), 0L} //
        );
  }

  public static TrafficLightStateMom toTrafficLightStateMom(
          TrafficLight trafficLight, ColorState colorState, Long remainingMs) {
    return new TrafficLightStateMom(
        trafficLight.getId(),
        colorState.getName().toLowerCase(),
        remainingMs,
        LocalDateTime.now() //
        );
  }
}
