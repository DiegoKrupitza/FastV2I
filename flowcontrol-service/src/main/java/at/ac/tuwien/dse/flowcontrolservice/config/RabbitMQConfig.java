package at.ac.tuwien.dse.flowcontrolservice.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

  @Value("${flowcontrol.carStateMom}")
  String carStateQueueName;

  @Value("flowcontrol.speedMom")
  String speedQueueName;

  @Bean
  public Queue carQueue() {
    return new Queue(carStateQueueName);
  }

  @Bean
  public Queue speedQueue() {
    return new Queue(speedQueueName);
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
