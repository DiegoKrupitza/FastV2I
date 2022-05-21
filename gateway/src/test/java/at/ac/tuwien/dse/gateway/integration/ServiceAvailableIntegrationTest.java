package at.ac.tuwien.dse.gateway.integration;

import at.ac.tuwien.dse.gateway.service.HealthService;
import at.ac.tuwien.dse.gateway.service.ServiceDto;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.WebTestClient;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;

@SpringBootTest
@AutoConfigureWebTestClient
class ServiceAvailableIntegrationTest {

  @MockBean
  private HealthService healthService;

  @Autowired private WebTestClient testClient;

  @Test
  void testServicesAvailableSuccess() {

    Mockito.when(healthService.getHealthStatus(any(),anyString()))
            .thenAnswer(invocationOnMock -> {
              String serviceName = invocationOnMock.getArgument(0, String.class);
              return new ServiceDto(serviceName.toUpperCase(),true);
            });

    this.testClient
        .get()
        .uri("/api/services")
        .accept(MediaType.APPLICATION_JSON)
        .exchange()
        .expectBody()
        .json(
                """
                [
                    {
                        "name": "ENTITY-SERVICE",
                        "up": true
                    },
                    {
                        "name": "TRACKING-SERVICE",
                        "up": true
                    },
                    {
                        "name": "SIMULATOR-SERVICE",
                        "up": true
                    },
                    {
                        "name": "FLOWCONTROL-SERVICE",
                        "up": true
                    }
                ]""");
  }

  @Test
  void failingServiceFound() {
    Mockito.when(healthService.getHealthStatus(any(),anyString())).thenAnswer(invocationOnMock -> {
      String serviceName = invocationOnMock.getArgument(0, String.class);
      if(serviceName.toUpperCase().contains("FLOWCONTROL")) {
        return new ServiceDto(serviceName.toUpperCase(),false);
      }else {
        return new ServiceDto(serviceName.toUpperCase(),true);
      }
    });

    this.testClient
            .get()
            .uri("/api/services")
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectBody()
            .json(
                    """
                    [
                        {
                            "name": "ENTITY-SERVICE",
                            "up": true
                        },
                        {
                            "name": "TRACKING-SERVICE",
                            "up": true
                        },
                        {
                            "name": "SIMULATOR-SERVICE",
                            "up": true
                        },
                        {
                            "name": "FLOWCONTROL-SERVICE",
                            "up": false
                        }
                    ]""");
    }
}
