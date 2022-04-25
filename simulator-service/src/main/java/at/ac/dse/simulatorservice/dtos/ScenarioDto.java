package at.ac.dse.simulatorservice.dtos;

import at.ac.dse.simulatorservice.domain.Car;
import at.ac.dse.simulatorservice.domain.TrafficLight;

import java.util.List;

/**
 * Defines a simulation scenario we want to run.
 * @param id the id of the scenario.
 * @param trafficLights collection of all the traffic lights we want to simulate.
 * @param cars collection of all the cars we want to simulate.
 * @param scenarioLength the length of the scenario in meters.
 * @param timelapse whether the simulation should be run in timelapse mode or not.
 * @param done boolean flag to indicate if the simulation is completed or not.
 */
public record ScenarioDto(String id, List<TrafficLight> trafficLights, List<Car> cars, Long scenarioLength,
    boolean timelapse, boolean done) {
}
