package at.ac.tuwien.dse.gateway.integration;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.cloud.client.DefaultServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.WebTestClient;

import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;

@SpringBootTest
@AutoConfigureWebTestClient
class CustomServicesIntegrationTest {

  @MockBean
  private DiscoveryClient discoveryClient;

  @Autowired private WebTestClient testClient;

  @Test
  void testServicesAvailableSuccess() {

    Mockito.when(discoveryClient.getInstances(any()))
        .thenReturn(List.of(new DefaultServiceInstance()));

    this.testClient
        .get()
        .uri("/services")
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
    Mockito.when(discoveryClient.getInstances(any())).thenAnswer(invocationOnMock -> {
      String serviceName = invocationOnMock.getArgument(0, String.class);
      if(serviceName.toUpperCase().contains("FLOWCONTROL")) {
        return Collections.emptyList();
      }else {
        return List.of(new DefaultServiceInstance());
      }
    });

    this.testClient
            .get()
            .uri("/services")
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
