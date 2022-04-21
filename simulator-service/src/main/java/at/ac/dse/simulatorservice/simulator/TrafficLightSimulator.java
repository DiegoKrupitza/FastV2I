package at.ac.dse.simulatorservice.simulator;

import at.ac.dse.simulatorservice.config.SimulatorProperties;
import at.ac.dse.simulatorservice.dtos.TrafficLightDto;
import at.ac.dse.simulatorservice.simulator.helper.ColorState;
import at.ac.dse.simulatorservice.simulator.helper.TrafficLightMapper;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

@AllArgsConstructor
@Data
@Slf4j
public class TrafficLightSimulator implements Runnable {

  private final SimulatorProperties simulatorProperties;
  private final RabbitTemplate rabbitTemplate;
  private final boolean timelapse;
  private TrafficLightDto trafficLight;

  @Override
  public void run() {
    log.info("Started simulation for the traffic light {}", trafficLight.getId());

    // Register traffic light in entity-service
    rabbitTemplate.convertAndSend(
        simulatorProperties.getTrafficLightMom(),
        TrafficLightMapper.toTrafficLightMom(trafficLight));

    // init states
    var colorState = ColorState.RED;

    rabbitTemplate.convertAndSend(
        simulatorProperties.getTrafficLightStateMom(),
        TrafficLightMapper.toTrafficLightStateMom(
            trafficLight,
            colorState,
            adjustedTime(trafficLight.getEntryDelay() + (trafficLight.getStateHoldInMs()))));

    try {
      Thread.sleep(adjustedTime(trafficLight.getEntryDelay() + trafficLight.getStateHoldInMs()));
    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
    }

    // refreshing interval
    // TODO: find good way to find a dynamic refresh interval
    // since holdtime is always a multiple of a full second we can assume naively here 100ms
    long refreshIntervalMs = 100;

    while (!Thread.currentThread().isInterrupted()) {

      // update state
      colorState = (colorState == ColorState.GREEN ? ColorState.RED : ColorState.GREEN);

      for (long remainingTime = trafficLight.getStateHoldInMs();
          remainingTime > 0 && !Thread.currentThread().isInterrupted();
          remainingTime -= refreshIntervalMs) {

        rabbitTemplate.convertAndSend(
            simulatorProperties.getTrafficLightStateMom(),
            TrafficLightMapper.toTrafficLightStateMom(trafficLight, colorState, remainingTime));
        try {
          Thread.sleep(adjustedTime(refreshIntervalMs));
        } catch (InterruptedException e) {
          Thread.currentThread().interrupt();
        }
      }
    }
  }

  private Long adjustedTime(Long timeInMs) {
    return this.timelapse ? timeInMs / this.simulatorProperties.getTimelapseDivider() : timeInMs;
  }
}
