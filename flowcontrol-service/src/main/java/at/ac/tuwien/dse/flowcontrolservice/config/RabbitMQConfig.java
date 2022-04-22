package at.ac.tuwien.dse.flowcontrolservice.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class RabbitMQConfig {

  /*
  @Value("${flowcontrol.carStateMom}")
  String carStateQueueName;

  @Value("${flowcontrol.speedMom}")
  String speedQueueName;
   */

  private final FlowControlProperties flowControlProperties;

  @Bean
  public Queue carQueue() {
    return new Queue(flowControlProperties.getCarStateFlowMom());
  }

  @Bean
  public Queue speedQueue() {
    return new Queue(flowControlProperties.getSpeedMom());
  }

  @Bean("jackSonMessageConverted")
  public MessageConverter converter(ObjectMapper objectMapper) {
    return new Jackson2JsonMessageConverter(objectMapper);
  }

  @Bean
  public AmqpTemplate template(
      ConnectionFactory connectionFactory,
      @Qualifier("jackSonMessageConverted") MessageConverter messageConverter) {
    final RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
    rabbitTemplate.setMessageConverter(messageConverter);
    return rabbitTemplate;
  }
}
