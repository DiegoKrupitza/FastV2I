package at.ac.dse.simulatorservice.simulator;

import at.ac.dse.simulatorservice.config.SimulatorProperties;
import at.ac.dse.simulatorservice.dtos.CarDto;
import at.ac.dse.simulatorservice.services.FlowControlSpeedService;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

@AllArgsConstructor
@Data
public class CarSimulator implements Runnable {

  private final SimulatorProperties simulatorProperties;
  private final FlowControlSpeedService flowControlSpeedRecommendation;
  private final RabbitTemplate rabbitTemplate;
  private CarDto car;

  @Override
  public void run() {

    // Register car in entity-service
    rabbitTemplate.convertAndSend(simulatorProperties.getCarMom(), car);

    // TODO: simulator logic for car
    // rabbitTemplate.convertAndSend("Car", "Hey!");
  }
}
