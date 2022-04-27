package at.ac.dse.simulatorservice.dtos;

import at.ac.dse.simulatorservice.domain.Car;
import at.ac.dse.simulatorservice.domain.TrafficLight;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;

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
public record ScenarioDto(@Schema(description = "ID of scenario") String id,
                          @ArraySchema(schema = @Schema(description = "Collection of all the traffic lights we want to simulate", implementation = TrafficLight.class)) List<TrafficLight> trafficLights,
                          @ArraySchema(schema = @Schema(description = "Collection of all the cars we want to simulate", implementation = Car.class)) List<Car> cars,
                          @Schema(description = "The length of the scenario in meters", example = "20000") Long scenarioLength,
                          @Schema(description = "Whether the simulation should be run in timelapse mode or not", example = "false") boolean timelapse,
                          @Schema(description = "Boolean flag to indicate if the simulation is completed or not", example = "false") boolean done) {
}
