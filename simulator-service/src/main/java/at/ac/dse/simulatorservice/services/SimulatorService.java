package at.ac.dse.simulatorservice.services;

import at.ac.dse.simulatorservice.config.SimulatorProperties;
import at.ac.dse.simulatorservice.dtos.CarDto;
import at.ac.dse.simulatorservice.dtos.ScenarioDto;
import at.ac.dse.simulatorservice.dtos.TrafficLightDto;
import at.ac.dse.simulatorservice.services.feign.EntityServiceFeign;
import at.ac.dse.simulatorservice.services.feign.TrackingServiceFeign;
import at.ac.dse.simulatorservice.simulator.CarSimulator;
import at.ac.dse.simulatorservice.simulator.TrafficLightSimulator;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.scheduling.concurrent.ConcurrentTaskExecutor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Future;

@Service
@RequiredArgsConstructor
public class SimulatorService {

  private final RabbitTemplate rabbitTemplate;
  private final ConcurrentTaskExecutor taskExecutor;

  private final SimulatorProperties simulatorProperties;

  private final List<Future<?>> threads = new ArrayList<>();
  private final FlowControlSpeedService flowControlSpeedRecommendation;

  private final EntityServiceFeign entityServiceFeign;
  private final TrackingServiceFeign trackingServiceFeign;

  /**
   * Stars a given simulation scenario.
   *
   * @param scenario the scenario to simulate. The scenario has to valid.
   */
  public void startScenario(ScenarioDto scenario) {

    for (TrafficLightDto trafficLight : scenario.trafficLights()) {
      threads.add(
          this.taskExecutor.submit(
              new TrafficLightSimulator(
                  simulatorProperties, rabbitTemplate, scenario.timelapse(), trafficLight)));
    }

    for (CarDto car : scenario.cars()) {
      threads.add(
          this.taskExecutor.submit(
              new CarSimulator(
                  simulatorProperties,
                  flowControlSpeedRecommendation,
                  rabbitTemplate,
                  scenario.timelapse(),
                  car)));
    }
  }

  /** Resets the simulation and propagates the reset to all the other services */
  public void resetSimulation() {
    // TODO: check if logic to kill the threads works
    this.threads.forEach(item -> item.cancel(true));
    this.flowControlSpeedRecommendation.reset();

    // propagate the reset to the tracking services
    this.entityServiceFeign.resetAll();
    this.trackingServiceFeign.resetAll();
  }
}
