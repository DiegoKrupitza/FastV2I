package at.ac.dse.simulatorservice.simulator;

import at.ac.dse.simulatorservice.config.SimulatorProperties;
import at.ac.dse.simulatorservice.domain.Car;
import at.ac.dse.simulatorservice.services.FlowControlSpeedService;
import at.ac.dse.simulatorservice.simulator.domain.CarStateMom;
import at.ac.dse.simulatorservice.simulator.domain.Direction;
import at.ac.dse.simulatorservice.simulator.mapper.CarMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import java.util.Optional;

import static at.ac.dse.simulatorservice.simulator.mapper.CarMapper.toCarStateMom;

@Slf4j
public class CarSimulator extends SimulatorBase {

  private final FlowControlSpeedService flowControlSpeedRecommendation;
  private final Car car;
  private Direction direction;

  public CarSimulator(
      SimulatorProperties simulatorProperties,
      RabbitTemplate rabbitTemplate,
      boolean timelapse,
      FlowControlSpeedService flowControlSpeedRecommendation,
      Car car) {
    super(simulatorProperties, rabbitTemplate, timelapse);
    this.flowControlSpeedRecommendation = flowControlSpeedRecommendation;
    this.car = car;
  }

  @Override
  void setup() throws InterruptedException {
    log.info("Started simulation for the car {}", car.getVin());

    // Register car in entity-service
    getRabbitTemplate()
        .convertAndSend(getSimulatorProperties().getCarMom(), CarMapper.toCarMom(car));

    // determine which direction we are going
    direction = Direction.getFromStartAndDestination(car.getLocation(), car.getDestination());

    log.info("Car {} will drive in direction {}", car.getVin(), direction.getName());

    // if entry is delayed we wait until this is done. If timelapse is enabled the waiting time
    // decreases significantly

    // entry time is in milliseconds
    if (car.getEntryTime() > 0) {
      log.info(
          "Car {} will wait {} ms since it until it will enter the scene",
          car.getVin(),
          car.getEntryTime());

      Thread.sleep(adjustedTime(car.getEntryTime()));
    }
  }

  @Override
  void loopBody() throws InterruptedException {
    log.info("Position of car {} is {}", car.getVin(), car.getLocation());
    Optional<Long> advisedSpeed = this.flowControlSpeedRecommendation.get(car.getVin());

    // if flow control service told us to speed up or slow down we need to obey
    if (advisedSpeed.isPresent() && !advisedSpeed.get().equals(car.getSpeed())) {
      log.info(
          "Car {} advised change speed from {} to {}",
          car.getVin(),
          car.getSpeed(),
          advisedSpeed.get());
      car.setSpeed(advisedSpeed.get());
    }

    Long pointsToMove = car.getSpeed();

    Long newLocation = car.getLocation() + (direction.getModificator() * pointsToMove);
    car.setLocation(newLocation);
    // stop if we reached our position
    if (car.getDestination() <= (car.getLocation() * direction.getModificator())) {
      log.info("Car {} reached its destinations", car.getVin());

      car.setLocation(car.getDestination());
      sendCarStateToMom();

      stop();
      return;
    }

    sendCarStateToMom();

    Thread.sleep(adjustedTime(1000L));
  }

  private void sendCarStateToMom() {
    CarStateMom momObject = toCarStateMom(car, direction);
    getRabbitTemplate().convertAndSend(getSimulatorProperties().getCarStateMom(), momObject);
  }
}
