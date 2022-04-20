package at.ac.dse.simulatorservice.simulator;

import at.ac.dse.simulatorservice.config.SimulatorProperties;
import at.ac.dse.simulatorservice.dtos.TrafficLightDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

@AllArgsConstructor
@Data
public class TrafficLightSimulator implements Runnable {

  private final SimulatorProperties simulatorProperties;
  private final RabbitTemplate rabbitTemplate;
  private TrafficLightDto trafficLight;

  @Override
  public void run() {
    // TODO: simulator logic for traffic light

  }
}
