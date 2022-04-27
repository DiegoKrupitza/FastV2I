package at.ac.dse.simulatorservice.endpoints;

import at.ac.dse.simulatorservice.dtos.ScenarioDto;
import at.ac.dse.simulatorservice.services.SimulatorService;
import at.ac.dse.simulatorservice.services.ValidatorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

/** RestController for the resource simulator. */
@RestController
@RequestMapping("/simulator")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "ScenarioController", description = "Endpoint for controlling the simulation")
public class ScenarioController {

  private final SimulatorService simulatorService;
  private final ValidatorService validatorService;

  /** Is a simulation active or not. */
  @GetMapping
  @Operation(summary = "Get status of simulation",
          description = "Returns the information of the simulation or null",
          responses = @ApiResponse(responseCode = "200", description = "Successful response",
                  content = @Content(mediaType = "application/json",
                         schema = @Schema(implementation = ScenarioDto.class))))
  public ScenarioDto activeSimulation() {
    log.info("Called active sim!");
    return simulatorService.getActiveSimulation();
  }

  /**
   * Triggers a simulation based on the provided scenario. If the scenario is invalid the simulation
   * won't be triggered.
   *
   * @param scenario the scenario to simulate
   */
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  @Operation(summary = "Get status of simulation",
          description = "Returns the information of the simulation or null",
          responses = {@ApiResponse(responseCode = "201", description = "Successful response"),
          @ApiResponse(responseCode = "400", description = "Validation error, see error message for more information")})
  public void setScenario( @org.springframework.web.bind.annotation.RequestBody
                             @RequestBody(description = "The scenario to simulate", required = true,
          content = @Content(schema = @Schema(implementation = ScenarioDto.class))) ScenarioDto scenario) {
    validatorService.validateScenario(scenario);
    simulatorService.startScenario(scenario);
  }

  /**
   * Stops an active simulation and makes sure the other services return to an pre simulation state.
   */
  @DeleteMapping
  @Operation(summary = "Stops the simulation",
          description = "Stops an active simulation and makes sure the other services return to an pre simulation state",
          responses = @ApiResponse(responseCode = "200",description = "Successful response"))
  public void reset() {
    log.info("Reset the simulator requested");
    this.simulatorService.resetSimulation();
  }
}
