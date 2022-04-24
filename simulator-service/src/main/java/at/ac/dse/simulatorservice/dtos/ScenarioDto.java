package at.ac.dse.simulatorservice.dtos;

import at.ac.dse.simulatorservice.domain.Car;
import at.ac.dse.simulatorservice.domain.TrafficLight;

import java.util.List;

/**
 * @author Diego Krupitza
 * @version 1.0
 * @date 20.04.22
 */
public record ScenarioDto(String id, List<TrafficLight> trafficLights, List<Car> cars, Long scenarioLength,
    boolean timelapse, boolean done) {
}
