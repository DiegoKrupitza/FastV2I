package at.ac.tuwien.dse.flowcontrolservice.listener;

import at.ac.tuwien.dse.flowcontrolservice.dto.DemoDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;

@Service
@Slf4j
@RequiredArgsConstructor
public class RabbitMQListener {

  private final RabbitTemplate rabbitTemplate;

  @RabbitListener(queues = "${dse.rabbitmq.carQueueName}")
  public void processPaymentMessage(final DemoDto demoDto) {
    log.info("Received on myqueue: " + demoDto.name());
  }

  @RabbitListener(queues = "${dse.rabbitmq.speedQueueName}")
  public void processOrderMessage(Object message) {
    log.info("Message is of type: " + message.getClass().getName());
    if (!(message instanceof byte[])) message = ((Message) message).getBody();
    String content = new String((byte[]) message, StandardCharsets.UTF_8);
    log.info("Received on myotherqueue: " + content);
  }
}
