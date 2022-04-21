package at.ac.dse.simulatorservice.simulator.helper;

import at.ac.dse.simulatorservice.dtos.TrafficLightDto;

import java.time.LocalDateTime;

public abstract class TrafficLightMapper {

  public static TrafficLightMom toTrafficLightMom(TrafficLightDto trafficLightDto) {
    return new TrafficLightMom(
        trafficLightDto.getId(), //
        trafficLightDto.getScanDistance(), //
        new Long[] {trafficLightDto.getPosition(), 0L} //
        );
  }

  public static TrafficLightStateMom toTrafficLightStateMom(
      TrafficLightDto trafficLightDto, ColorState colorState, Long remainingMs) {
    return new TrafficLightStateMom(
        trafficLightDto.getId(),
        colorState.getName().toLowerCase(),
        remainingMs,
        LocalDateTime.now() //
        );
  }
}
