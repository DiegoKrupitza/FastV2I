package at.ac.dse.simulatorservice.dtos;

import java.util.List;

/**
 * @author Diego Krupitza
 * @version 1.0
 * @date 20.04.22
 */
public record ScenarioDto(List<TrafficLightDto> trafficLights, List<CarDto> cars, Long scenarioLength, boolean timelapse) {
}