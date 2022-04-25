package at.ac.dse.simulatorservice.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** Configuration for our rabbitmq listeners. */
@Configuration
@RequiredArgsConstructor
public class RabbitMQConfig {

  private final SimulatorProperties simulatorProperties;

  @Bean
  public FanoutExchange fanout() {
    return new FanoutExchange(simulatorProperties.getFanoutName());
  }

  @Bean
  public Binding bindingCarStateTracking(FanoutExchange fanout, Queue carStateTrackingQueue) {
    return BindingBuilder.bind(carStateTrackingQueue).to(fanout);
  }

  @Bean
  public Binding bindingCarStateFlow(FanoutExchange fanout, Queue carStateFlowQueue) {
    return BindingBuilder.bind(carStateFlowQueue).to(fanout);
  }

  @Bean
  public Queue carQueue() {
    return new Queue(simulatorProperties.getCarMom());
  }

  @Bean
  public Queue carStateTrackingQueue() {
    return new Queue(simulatorProperties.getCarStateTrackingMom());
  }

  @Bean
  public Queue carStateFlowQueue() {
    return new Queue(simulatorProperties.getCarStateFlowMom());
  }

  @Bean
  public Queue trafficLightQueue() {
    return new Queue(simulatorProperties.getTrafficLightMom());
  }

  @Bean
  public Queue trafficLightStateQueue() {
    return new Queue(simulatorProperties.getTrafficLightStateMom());
  }

  @Bean
  public Queue speedQueue() {
    return new Queue(simulatorProperties.getSpeedMom());
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
