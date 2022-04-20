package at.ac.dse.simulatorservice.endpoints;

import at.ac.dse.simulatorservice.services.EntityServiceFeign;
import at.ac.dse.simulatorservice.config.SimulatorProperties;
import at.ac.dse.simulatorservice.dtos.CarDto;
import at.ac.dse.simulatorservice.dtos.ScenarioDto;
import at.ac.dse.simulatorservice.dtos.TrafficLightDto;
import at.ac.dse.simulatorservice.simulator.CarSimulator;
import at.ac.dse.simulatorservice.services.FlowControlSpeedService;
import at.ac.dse.simulatorservice.simulator.TrafficLightSimulator;
import lombok.RequiredArgsConstructor;
import org.javatuples.Pair;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.concurrent.ConcurrentTaskExecutor;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.*;

import javax.validation.ValidationException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.Future;

@RestController
@RequestMapping("/simulator")
@RequiredArgsConstructor
public class ScenarioController {

  private final RabbitTemplate rabbitTemplate;
  private final ConcurrentTaskExecutor taskExecutor;

  private final SimulatorProperties simulatorProperties;

  private final List<Future<?>> threads = new ArrayList<>();
  private final FlowControlSpeedService flowControlSpeedRecommendation;

  private final EntityServiceFeign entityServiceFeign;

  @GetMapping
  public boolean simulationActive() {
    // TODO: find a way to get if threads are simulating or not from executor
    return false;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public void setScenario(@RequestBody ScenarioDto scenario) {

    validateScenario(scenario);

    for (TrafficLightDto trafficLight : scenario.trafficLights()) {
      threads.add(
          this.taskExecutor.submit(
              new TrafficLightSimulator(simulatorProperties, rabbitTemplate, trafficLight)));
    }

    for (CarDto car : scenario.cars()) {
      threads.add(
          this.taskExecutor.submit(
              new CarSimulator(
                  simulatorProperties, flowControlSpeedRecommendation, rabbitTemplate, car)));
    }
  }

  private void validateScenario(ScenarioDto scenario) {

    if (CollectionUtils.isEmpty(scenario.trafficLights())) {
      throw new ValidationException("You have to provide at least one traffic light");
    }

    scenario.trafficLights().sort(Comparator.comparingLong(TrafficLightDto::getPosition));

    TrafficLightDto firstTrafficLight = scenario.trafficLights().get(0);
    TrafficLightDto lastTrafficLight =
        scenario.trafficLights().get(scenario.trafficLights().size() - 1);

    // check that the scan lines of the first and last are not outside the scenario range
    if (firstTrafficLight.getPosition() - firstTrafficLight.getScanDistance() <= 0) {
      throw new ValidationException(
          "Scan distance of first traffic light is outside the scenario (make sure position - scandistance > 0)!");
    }

    if (lastTrafficLight.getPosition() + lastTrafficLight.getScanDistance()
        >= scenario.scenarioLength()) {
      throw new ValidationException(
          "Scan distance of last traffic light is outside the scenario (make sure position + scandistance < scenariolength)!");
    }

    // check that scan distance ends right at prev or next traffic light
    checkTrafficLightScanDistance(scenario.trafficLights());

    // cars are not allowed to stop in scan distance of traffic lights
    List<Pair<Long, Long>> notAllowedToStopPositions =
        scenario.trafficLights().stream()
            .map(
                item ->
                    Pair.with(
                        item.getPosition() + item.getScanDistance(),
                        item.getPosition() - item.getScanDistance()))
            .toList();

    boolean carDestinationInScaningDistance =
        scenario.cars().stream()
            .anyMatch(item -> parkingWrongSpot(item, notAllowedToStopPositions));

    if (carDestinationInScaningDistance) {
      throw new ValidationException(
          "Cars are not allowed to stop inside the scan distance of a traffic light!");
    }

    // cars are not allowed to end after the scenario end
    boolean destinationsOvershoot =
        scenario.cars().stream()
            .anyMatch(
                item ->
                    item.getDestination() > scenario.scenarioLength() || item.getDestination() < 0);
    if (destinationsOvershoot) {
      throw new ValidationException(
          "There are cars with destination outside of the scenario range 0 - %d"
              .formatted(scenario.scenarioLength()));
    }

    // cars not to slow or to fast
    boolean carOutsideOfSpeedWindow =
        scenario.cars().stream()
            .anyMatch(
                item ->
                    item.getSpeed() > simulatorProperties.getMaxCarSpeed()
                        || item.getSpeed() < simulatorProperties.getMinCarSpeed());

    if (carOutsideOfSpeedWindow) {
      throw new ValidationException(
          "The init speed of a car has to be between (inclusive) %d and (inclusive) %s"
              .formatted(
                  simulatorProperties.getMinCarSpeed(), simulatorProperties.getMaxCarSpeed()));
    }
  }

  private void checkTrafficLightScanDistance(List<TrafficLightDto> trafficLights) {
    if (trafficLights.size() == 1) {
      return;
    }

    for (int i = 0; i < trafficLights.size() - 2; i++) {

      var currentTrafficLight = trafficLights.get(i);
      var next = trafficLights.get(i + 1);

      // check that current scan does stop before next traffic light
      if (currentTrafficLight.getPosition() + currentTrafficLight.getScanDistance()
          >= next.getPosition()) {
        throw new ValidationException(
            "Traffic light %s (P: %d, SC: %d) scan distance overshoots the next traffic light %s (P: %d)"
                .formatted(
                    currentTrafficLight.getId(),
                    currentTrafficLight.getPosition(),
                    currentTrafficLight.getScanDistance(),
                    next.getId(),
                    next.getPosition()));
      }

      // check that next scan line does stop before current traffic light
      if (next.getPosition() - next.getScanDistance() <= currentTrafficLight.getPosition()) {
        throw new ValidationException(
            "Traffic light %s (P: %d, SC: %d) scan distance overshoots the prev traffic light %s (P: %d)"
                .formatted(
                    next.getId(),
                    next.getPosition(),
                    next.getScanDistance(),
                    currentTrafficLight.getId(),
                    currentTrafficLight.getPosition()));
      }
    }
  }

  private boolean parkingWrongSpot(CarDto item, List<Pair<Long, Long>> notAllowedToStopPositions) {

    for (Pair<Long, Long> notAllowedToStopPosition : notAllowedToStopPositions) {
      // inside a not allowed position
      if (notAllowedToStopPosition.getValue0() > item.getDestination()
          && notAllowedToStopPosition.getValue1() < item.getDestination()) {
        return true;
      }
    }

    return false;
  }

  @DeleteMapping
  public void reset() {

    // TODO: logic to kill the threads
    this.threads.forEach(item -> item.cancel(true));
    this.flowControlSpeedRecommendation.reset();

    this.entityServiceFeign.resetAll();
  }
}
