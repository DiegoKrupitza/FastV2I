package at.ac.dse.simulatorservice.endpoints;

import at.ac.dse.simulatorservice.dtos.ScenarioDto;
import at.ac.dse.simulatorservice.services.SimulatorService;
import at.ac.dse.simulatorservice.services.ValidatorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

/** RestController for the resource simulator. */
@RestController
@RequestMapping("/simulator")
@RequiredArgsConstructor
@Slf4j
public class ScenarioController {

  private final SimulatorService simulatorService;
  private final ValidatorService validatorService;

  /** Is a simulation active or not. */
  @GetMapping
  public ScenarioDto activeSimulation() {
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
  public void setScenario(@RequestBody ScenarioDto scenario) {
    validatorService.validateScenario(scenario);
    simulatorService.startScenario(scenario);
  }

  /**
   * Stops an active simulation and makes sure the other services return to an pre simulation state.
   */
  @DeleteMapping
  public void reset() {
    log.info("Reset the simulator requested");
    this.simulatorService.resetSimulation();
  }
}
