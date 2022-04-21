package at.ac.dse.simulatorservice.simulator;

import at.ac.dse.simulatorservice.config.SimulatorProperties;
import at.ac.dse.simulatorservice.domain.TrafficLight;
import at.ac.dse.simulatorservice.simulator.domain.ColorState;
import at.ac.dse.simulatorservice.simulator.mapper.TrafficLightMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

@Slf4j
public class TrafficLightSimulator extends SimulatorBase {

  private final TrafficLight trafficLight;
  private ColorState colorState;
  private Long refreshIntervalMs;

  public TrafficLightSimulator(
      SimulatorProperties simulatorProperties,
      RabbitTemplate rabbitTemplate,
      boolean timelapse,
      TrafficLight trafficLight) {
    super(simulatorProperties, rabbitTemplate, timelapse);
    this.trafficLight = trafficLight;
  }

  @Override
  void setup() throws InterruptedException {
    log.info("Started simulation for the traffic light {}", trafficLight.getId());

    // Register traffic light in entity-service
    getRabbitTemplate()
        .convertAndSend(
            getSimulatorProperties().getTrafficLightMom(),
            TrafficLightMapper.toTrafficLightMom(trafficLight));

    // init states
    colorState = ColorState.RED;

    getRabbitTemplate()
        .convertAndSend(
            getSimulatorProperties().getTrafficLightStateMom(),
            TrafficLightMapper.toTrafficLightStateMom(
                trafficLight,
                colorState,
                adjustedTime(trafficLight.getEntryDelay() + (trafficLight.getStateHoldInMs()))));

    Thread.sleep(adjustedTime(trafficLight.getEntryDelay() + trafficLight.getStateHoldInMs()));

    // refreshing interval
    // TODO: find good way to find a dynamic refresh interval
    // since holdtime is always a multiple of a full second we can assume naively here 100ms
    refreshIntervalMs = 100L;
  }

  @Override
  void loopBody() throws InterruptedException {
    // update state
    colorState = (colorState == ColorState.GREEN ? ColorState.RED : ColorState.GREEN);
    log.info("Traffic light {} changed to color {}", trafficLight.getId(), colorState.getName());

    for (long remainingTime = trafficLight.getStateHoldInMs();
        remainingTime > 0 && !isInterrupted();
        remainingTime -= refreshIntervalMs) {

      getRabbitTemplate()
          .convertAndSend(
              getSimulatorProperties().getTrafficLightStateMom(),
              TrafficLightMapper.toTrafficLightStateMom(trafficLight, colorState, remainingTime));

      Thread.sleep(adjustedTime(refreshIntervalMs));
    }
  }
}
