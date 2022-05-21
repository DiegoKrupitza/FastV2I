package at.ac.tuwien.dse.flowcontrolservice;

import at.ac.tuwien.dse.flowcontrolservice.config.FlowControlProperties;
import at.ac.tuwien.dse.flowcontrolservice.dto.CarStateDto;
import at.ac.tuwien.dse.flowcontrolservice.dto.NearestTrafficLightDto;
import at.ac.tuwien.dse.flowcontrolservice.dto.NearestTrafficLightStateDto;
import at.ac.tuwien.dse.flowcontrolservice.dto.SpeedDto;
import at.ac.tuwien.dse.flowcontrolservice.service.EntityServiceFeign;
import at.ac.tuwien.dse.flowcontrolservice.service.TrackingServiceFeign;
import lombok.SneakyThrows;
import org.jetbrains.annotations.NotNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.util.TestPropertyValues;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.test.context.ContextConfiguration;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ContextConfiguration(initializers = {SpeedCalculationIntegrationTest.Initializer.class})
@ExtendWith({MockitoExtension.class})
@Testcontainers(disabledWithoutDocker = true)
class SpeedCalculationIntegrationTest {

  private static final Long TRAFFIC_LIGHT_LOCATION = 4000L;
  private static final Long OFFSET_CAR_TRAFFIC_LIGHT = 45L;
  private CarStateDto car;
  private NearestTrafficLightDto trafficLight;
  private NearestTrafficLightStateDto trafficLightRed;
  private NearestTrafficLightStateDto trafficLightGreen;

  @Autowired private FlowControlProperties flowControlProperties;

  @Container
  public static GenericContainer<?> rabbit =
      new GenericContainer<>(DockerImageName.parse("rabbitmq:3-management"))
          .withExposedPorts(5672, 15672);

  @Autowired private RabbitTemplate rabbitTemplate;

  @Autowired private FlowControlProperties properties;
  @MockBean private EntityServiceFeign entityService;
  @MockBean private TrackingServiceFeign trackingService;

  static class Initializer
      implements ApplicationContextInitializer<ConfigurableApplicationContext> {
    @Override
    public void initialize(@NotNull ConfigurableApplicationContext configurableApplicationContext) {
      var values =
          TestPropertyValues.of(
              "spring.rabbitmq.host=" + rabbit.getContainerIpAddress(),
              "spring.rabbitmq.port=" + rabbit.getMappedPort(5672));
      values.applyTo(configurableApplicationContext);
    }
  }

  @BeforeEach
  void setup() {
    car =
        new CarStateDto(
            "V1",
            TRAFFIC_LIGHT_LOCATION - OFFSET_CAR_TRAFFIC_LIGHT,
            flowControlProperties.getMaxCarSpeed(),
            "NTS",
            LocalDateTime.now(ZoneOffset.UTC));
    trafficLight = new NearestTrafficLightDto("T1", TRAFFIC_LIGHT_LOCATION, 1000L);
    trafficLightRed = new NearestTrafficLightStateDto("red", 1000L);
    trafficLightGreen = new NearestTrafficLightStateDto("green", 1000L);
  }

  @SneakyThrows
  @Test
  void speedStaysTheSameWhenNoTrafficLightIsInScanDistance() {
    Mockito.when(entityService.getNearestTrafficLight(Mockito.any(), Mockito.any()))
        .thenReturn(Optional.empty());
    rabbitTemplate.convertAndSend(properties.getCarStateFlowMom(), car);
    SpeedDto message =
        rabbitTemplate.receiveAndConvert(
            properties.getSpeedMom(), 5000, ParameterizedTypeReference.forType(SpeedDto.class));

    assertThat(message).isNotNull();
    assertThat(message.speed()).isEqualTo(car.speed());
  }

  @SneakyThrows
  @Test
  void carStopsInFrontOfRedTrafficLight() {
    Mockito.when(entityService.getNearestTrafficLight(Mockito.any(), Mockito.any()))
        .thenReturn(Optional.of(trafficLight));
    Mockito.when(trackingService.getNearestTrafficLightState(trafficLight.id()))
        .thenReturn(trafficLightRed);

    rabbitTemplate.convertAndSend(properties.getCarStateFlowMom(), car);

    SpeedDto message =
        rabbitTemplate.receiveAndConvert(
            properties.getSpeedMom(), 5000, ParameterizedTypeReference.forType(SpeedDto.class));
    assertThat(message).isNotNull();
    assertThat(message.speed()).isZero();
  }

  @SneakyThrows
  @Test
  void carDrivesInFrontOfGreenTrafficLight() {
    Mockito.when(entityService.getNearestTrafficLight(Mockito.any(), Mockito.any()))
        .thenReturn(Optional.of(trafficLight));
    Mockito.when(trackingService.getNearestTrafficLightState(trafficLight.id()))
        .thenReturn(trafficLightGreen);

    rabbitTemplate.convertAndSend(properties.getCarStateFlowMom(), car);

    SpeedDto message =
        rabbitTemplate.receiveAndConvert(
            properties.getSpeedMom(), 5000, ParameterizedTypeReference.forType(SpeedDto.class));
    assertThat(message).isNotNull();
    // 0 is not positive
    assertThat(message.speed()).isPositive();
  }
}
