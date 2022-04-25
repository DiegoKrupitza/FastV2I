package at.ac.tuwien.dse.flowcontrolservice.listener;

import at.ac.tuwien.dse.flowcontrolservice.config.FlowControlProperties;
import at.ac.tuwien.dse.flowcontrolservice.dto.CarStateDto;
import at.ac.tuwien.dse.flowcontrolservice.dto.SpeedDto;
import at.ac.tuwien.dse.flowcontrolservice.service.FlowControlService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

/** The main class for listening on the rabbitmq queues. */
@Service
@Slf4j
@RequiredArgsConstructor
public class RabbitMQListener {

  private final RabbitTemplate rabbitTemplate;
  private final FlowControlService flowControlService;
  private final FlowControlProperties flowControlProperties;

  /**
   * Listens on the car state queue and calculate the speed a car has to drive. The result is then
   * written back to the car-speed queue.
   *
   * @param car the car for which we want to calculate the advised speed.
   */
  @RabbitListener(queues = "${flowcontrol.carStateFlowMom}")
  public void carStateMomListener(final CarStateDto car) {
    Long speed = flowControlService.getAdvisedSpeed(car);
    rabbitTemplate.convertAndSend(
        flowControlProperties.getSpeedMom(), new SpeedDto(car.vin(), speed));
  }
}
