package at.ac.tuwien.dse.gateway;

import at.ac.tuwien.dse.gateway.service.HealthProps;
import at.ac.tuwien.dse.gateway.service.HealthService;
import at.ac.tuwien.dse.gateway.service.ServiceDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.stream.Stream;

/** Controller for the service resource */
@RequestMapping("services")
@RequiredArgsConstructor
@Slf4j
@RestController
@CrossOrigin
@Tag(
    name = "ServiceAvailableController",
    description = "Endpoint for getting status information about services")
public class ServiceAvailableController {

  private final HealthProps healthProps;
  private final HealthService healthService;

  /**
   * Lists the health status of the services our gateway is interacting with.
   *
   * @return the status of our services.
   */
  @GetMapping
  @Operation(
      summary = "Get status of all services",
      description = "Returns the status of all services",
      responses =
          @ApiResponse(
              responseCode = "200",
              description = "Successful response",
              content =
                  @Content(
                      mediaType = "application/json",
                      array = @ArraySchema(schema = @Schema(implementation = ServiceDto.class)))))
  public Stream<ServiceDto> getAllHealthyServices() {

    return healthProps.getServices().entrySet().stream()
        .map(item -> this.healthService.getHealthStatus(item.getKey(), item.getValue()));
  }
}
