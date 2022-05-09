package at.ac.dse.simulatorservice.endpoints.integration;

import at.ac.dse.simulatorservice.services.feign.EntityServiceFeign;
import at.ac.dse.simulatorservice.services.feign.TrackingServiceFeign;
import lombok.SneakyThrows;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
class ScenarioIntegrationTest {

  @Autowired private MockMvc mockMvc;

  @MockBean private EntityServiceFeign entityServiceFeign;

  @MockBean private TrackingServiceFeign trackingServiceFeign;

  @Test
  @SneakyThrows
  void resetOnNoSimulationWorks() {
    this.mockMvc.perform(MockMvcRequestBuilders.delete("/simulator")).andExpect(status().isOk());

    this.mockMvc
        .perform(MockMvcRequestBuilders.get("/simulator").accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$").doesNotExist());
  }

  @Test
  @SneakyThrows
  void resetOnExistingStopsIt() {
    String value = getDefaultScenario();
    this.mockMvc.perform(
        MockMvcRequestBuilders.post("/simulator")
            .accept(MediaType.APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON)
            .content(value))
            .andExpect(status().isCreated());

    this.mockMvc.perform(MockMvcRequestBuilders.delete("/simulator")).andExpect(status().isOk());

    this.mockMvc
        .perform(MockMvcRequestBuilders.get("/simulator").accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$").doesNotExist());
  }

  @Test
  @SneakyThrows
  void stateUpdated() {
    String value = getDefaultScenario();
    this.mockMvc.perform(
                    MockMvcRequestBuilders.post("/simulator")
                            .accept(MediaType.APPLICATION_JSON)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(value))
            .andExpect(status().isCreated());

    String contentAsString = this.mockMvc
            .perform(MockMvcRequestBuilders.get("/simulator").accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andReturn().getResponse().getContentAsString();

    assertThat(contentAsString).contains("T1","T2","V1","VW");

  }

  private String getDefaultScenario() {
    return """
            {
                "id": "test",
                "trafficLights": [
                    {
                        "id": "T1",
                        "position": 4000,
                        "scanDistance": 2000,
                        "entryDelay": 0,
                        "stateHoldSeconds": 10
                    },
                    {
                        "id": "T2",
                        "position": 8000,
                        "scanDistance": 2000,
                        "entryDelay": 0,
                        "stateHoldSeconds": 10
                    },
                    {
                        "id": "T3",
                        "position": 12000,
                        "scanDistance": 2000,
                        "entryDelay": 0,
                        "stateHoldSeconds": 10
                    }
                ],
                "cars": [
                    {
                        "vin":"V1",
                        "oem": "VW",
                        "model": "Caddy",
                        "entryTime": 0,
                        "speed": 10,
                        "location": 0,
                        "destination": 18000
                    },
                    {
                        "vin":"V2",
                        "oem": "BMW",
                        "model": "Z4",
                        "entryTime": 0,
                        "speed": 30,
                        "location": 18000,
                        "destination": 0
                    }
                ],
                "scenarioLength": 18000,
                "timelapse": true
            }
            """;
  }
}
