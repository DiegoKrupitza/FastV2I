package at.ac.dse.simulatorservice.listener;

import at.ac.dse.simulatorservice.services.FlowControlSpeedService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class CarSpeedListener {

  private final FlowControlSpeedService flowControlSpeedRecommendation;

  @RabbitListener(queues = "${simulator.speedMom}")
  public void processOrderMessage(SpeedMessageDto message) {
    if(message.vin() == null || message.speed() == null) {
      return;
    }

    log.info("Flow control tells car {} to ride with speed {} ",message.vin(),message.speed());
    this.flowControlSpeedRecommendation.set(message.vin(), message.speed());
  }


}

record SpeedMessageDto(String vin, Long speed) {}