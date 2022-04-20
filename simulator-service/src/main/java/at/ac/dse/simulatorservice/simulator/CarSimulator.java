package at.ac.dse.simulatorservice.simulator;

import at.ac.dse.simulatorservice.config.SimulatorProperties;
import at.ac.dse.simulatorservice.dtos.CarDto;
import at.ac.dse.simulatorservice.services.FlowControlSpeedService;
import at.ac.dse.simulatorservice.simulator.helper.CarStateMom;
import at.ac.dse.simulatorservice.simulator.helper.Direction;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import java.util.Optional;

import static at.ac.dse.simulatorservice.simulator.helper.CarMapper.toCarStateMom;

@AllArgsConstructor
@Data
@Slf4j
public class CarSimulator implements Runnable {

  private final SimulatorProperties simulatorProperties;
  private final FlowControlSpeedService flowControlSpeedRecommendation;
  private final RabbitTemplate rabbitTemplate;
  private CarDto car;

  @Override
  public void run() {
    log.info("Started simulation for the car {}", car.getVin());

    // Register car in entity-service
    rabbitTemplate.convertAndSend(simulatorProperties.getCarMom(), car);

    // determine which direction we are going
    Direction direction =
        Direction.getFromStartAndDestination(car.getLocation(), car.getDestination());

    log.info("Car {} will drive in direction {}", car.getVin(), direction.getName());

    // if entry is delayed we wait until this is done. If timelapse is enabled the waiting time
    // decreases significantly

    // entry time is in milliseconds
    if (car.getEntryTime() > 0) {
      log.info(
          "Car {} will wait {} ms since it until it will enter the scene",
          car.getVin(),
          car.getEntryTime());
      try {
        Thread.sleep(car.getEntryTime());
      } catch (InterruptedException e) {
        Thread.currentThread().interrupt();
      }
    }

    while (!Thread.currentThread().isInterrupted()) {
      Optional<Long> advisedSpeed = this.flowControlSpeedRecommendation.get(car.getVin());

      // if flow control service told us to speed up or slow down we need to obey
      if (advisedSpeed.isPresent() && !advisedSpeed.get().equals(car.getSpeed())) {
        log.info(
            "Car {} advised from the flow control service to drive at speed {}",
            car.getVin(),
            advisedSpeed.get());
        car.setSpeed(advisedSpeed.get());
      }

      // TODO: consider realtime or timelapse
      Long pointsToMove = car.getSpeed();

      Long newLocation = car.getLocation() + (direction.getModificator() * pointsToMove);
      car.setLocation(newLocation);

      CarStateMom momObject = toCarStateMom(car);
      rabbitTemplate.convertAndSend(this.simulatorProperties.getCarStateMom(), momObject);

      // stop if we reached our position
      if (car.getDestination() <= (car.getLocation() * direction.getModificator())) {
        log.info("Car {} reached its destinations", car.getVin());
        return;
      }

      try {
        Thread.sleep(1000L);
      } catch (InterruptedException e) {
        Thread.currentThread().interrupt();
      }
    }
  }
}
