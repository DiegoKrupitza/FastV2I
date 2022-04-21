package at.ac.dse.simulatorservice.services;

import at.ac.dse.simulatorservice.config.SimulatorProperties;
import at.ac.dse.simulatorservice.domain.Car;
import at.ac.dse.simulatorservice.dtos.ScenarioDto;
import at.ac.dse.simulatorservice.domain.TrafficLight;
import lombok.RequiredArgsConstructor;
import org.javatuples.Pair;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import javax.validation.ValidationException;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ValidatorService {

  private final SimulatorProperties simulatorProperties;

  /**
   * Validates a given scenario for the following rules:
   *
   * <ul>
   *   <li>At least one traffic light.
   *   <li>Scan lines of the first and last traffic light end before the boundaries of the scenario.
   *   <li>Car stops either at the boundary of the scenario or outside of scan lines.
   *   <li>Entry speed of the car does not violate the speed limit.
   *   <li>The scan line of a traffic light ends before the next traffic light position.
   * </ul>
   *
   * @param scenario the scenario to validate
   * @throws ValidationException in case one of the rules is violated
   */
  public void validateScenario(ScenarioDto scenario) throws ValidationException {

    if (CollectionUtils.isEmpty(scenario.trafficLights())) {
      throw new ValidationException("You have to provide at least one traffic light");
    }

    scenario.trafficLights().sort(Comparator.comparingLong(TrafficLight::getPosition));

    TrafficLight firstTrafficLight = scenario.trafficLights().get(0);
    TrafficLight lastTrafficLight =
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

  private void checkTrafficLightScanDistance(List<TrafficLight> trafficLights) {
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

  private boolean parkingWrongSpot(Car item, List<Pair<Long, Long>> notAllowedToStopPositions) {

    for (Pair<Long, Long> notAllowedToStopPosition : notAllowedToStopPositions) {
      // inside a not allowed position
      if (notAllowedToStopPosition.getValue0() > item.getDestination()
          && notAllowedToStopPosition.getValue1() < item.getDestination()) {
        return true;
      }
    }

    return false;
  }
}
