package at.ac.dse.simulatorservice.simulator;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class TrafficLightSimulator implements Runnable {

  private RabbitTemplate rabbitTemplate;

  @Override
  public void run() {
    // TODO: simulator logic for traffic light

  }
}
