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

@Service
@Slf4j
@RequiredArgsConstructor
public class RabbitMQListener {

  private final RabbitTemplate rabbitTemplate;
  private final FlowControlService flowControlService;
  private final FlowControlProperties flowControlProperties;

  @RabbitListener(queues = "${flowcontrol.carStateMom}")
  public void carStateMomListener(final CarStateDto car) {
    Long speed = flowControlService.getAdvisedSpeed(car);
    rabbitTemplate.convertAndSend(flowControlProperties.getSpeedMom(), new SpeedDto(car.vin(),speed));
  }
}
