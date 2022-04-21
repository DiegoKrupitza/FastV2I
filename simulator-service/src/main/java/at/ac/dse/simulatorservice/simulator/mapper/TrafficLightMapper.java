package at.ac.dse.simulatorservice.simulator.mapper;

import at.ac.dse.simulatorservice.dtos.TrafficLightDto;
import at.ac.dse.simulatorservice.simulator.domain.ColorState;
import at.ac.dse.simulatorservice.simulator.domain.TrafficLightMom;
import at.ac.dse.simulatorservice.simulator.domain.TrafficLightStateMom;

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
