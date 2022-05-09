package at.ac.dse.simulatorservice.simulator.mapper;

import at.ac.dse.simulatorservice.domain.TrafficLight;
import at.ac.dse.simulatorservice.simulator.domain.ColorState;
import at.ac.dse.simulatorservice.simulator.domain.TrafficLightMom;
import at.ac.dse.simulatorservice.simulator.domain.TrafficLightStateMom;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

/** Interface that is responsible for mapping various traffic light objects. */
public interface TrafficLightMapper {

  /** Maps a {@link TrafficLight} to a {@link TrafficLightMom} */
  static TrafficLightMom toTrafficLightMom(TrafficLight trafficLight) {
    return new TrafficLightMom(
        trafficLight.getId(), //
        trafficLight.getScanDistance(), //
        trafficLight.getPosition() //
        );
  }

  /**
   * Maps a {@link TrafficLight} with its {@link ColorState} and remaining time in that state to a
   * {@link TrafficLightStateMom}
   *
   * @param trafficLight the traffic light to map.
   * @param colorState the state of the traffic light.
   * @param remainingMs the remaning time the traffic light is in the {@code colorState}.
   */
  static TrafficLightStateMom toTrafficLightStateMom(
      TrafficLight trafficLight, ColorState colorState, Long remainingMs) {
    return new TrafficLightStateMom(
        trafficLight.getId(),
        colorState.getName().toLowerCase(),
        remainingMs,
        LocalDateTime.now(ZoneOffset.UTC) //
        );
  }
}
