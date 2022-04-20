package at.ac.dse.simulatorservice.config;

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

/**
 * @author Diego Krupitza
 * @version 1.0
 * @date 28.03.22
 */
@Configuration
public class MessageConfig {

  @Value("${simulator.carMom}")
  String carQueueName;

  @Value("${simulator.carStateMom}")
  String carStateQueueName;

  @Value("${simulator.trafficLightStateMom}")
  String trafficLightStateQueueName;

  @Value("${simulator.trafficLightMom}")
  String trafficLightQueueName;

  @Value("${simulator.speedMom}")
  String speedQueueName;

  @Bean
  public Queue carQueue() {
    return new Queue(carQueueName);
  }

  @Bean
  public Queue carStateQueue() {
    return new Queue(carStateQueueName);
  }

  @Bean
  public Queue trafficLightQueue() {
    return new Queue(trafficLightQueueName);
  }

  @Bean
  public Queue trafficLightStateQueue() {
    return new Queue(trafficLightStateQueueName);
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
