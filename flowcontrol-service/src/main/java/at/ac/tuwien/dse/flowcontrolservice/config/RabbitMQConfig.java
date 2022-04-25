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

/**
 * Configuration for the rabbitmq client of our flow control service. Here we also register all the
 * queue the flow control service interacts.
 */
@Configuration
@RequiredArgsConstructor
public class RabbitMQConfig {

  private final FlowControlProperties flowControlProperties;

  /** Register the queue for listening to the car state */
  @Bean
  public Queue carQueue() {
    return new Queue(flowControlProperties.getCarStateFlowMom());
  }

  /** Register the queue for writing the car speed */
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
