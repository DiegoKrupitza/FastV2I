package at.ac.dse.simulatorservice.listener;

import at.ac.dse.simulatorservice.services.FlowControlSpeedService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

/** The main class for listening on the rabbitmq speed queue. */
@Service
@Slf4j
@RequiredArgsConstructor
public class CarSpeedListener {

  private final FlowControlSpeedService flowControlSpeedRecommendation;

  /**
   * Listens on the car speed queue to communicate speed changes to the simulation
   * @param message the message from the queue.
   */
  @RabbitListener(queues = "${simulator.speedMom}")
  public void processOrderMessage(SpeedMessageDto message) {
    if(message.vin() == null || message.speed() == null) {
      return;
    }

    log.info("Flow control tells car {} to ride with speed {} ",message.vin(),message.speed());
    this.flowControlSpeedRecommendation.set(message.vin(), message.speed());
  }


}

/**
 * The MoM response object to communicate at what speed a given car has to drive.
 * @param vin the vin of the car.
 * @param speed the speed we advise driving.
 */
record SpeedMessageDto(String vin, Long speed) {}