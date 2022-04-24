package at.ac.dse.simulatorservice.endpoints;

import at.ac.dse.simulatorservice.dtos.ScenarioDto;
import at.ac.dse.simulatorservice.services.SimulatorService;
import at.ac.dse.simulatorservice.services.ValidatorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/simulator")
@RequiredArgsConstructor
@Slf4j
public class ScenarioController {

  private final SimulatorService simulatorService;
  private final ValidatorService validatorService;

  @GetMapping
  public ScenarioDto activeSimulation() {
    return simulatorService.getActiveSimulation();
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public void setScenario(@RequestBody ScenarioDto scenario) {
    validatorService.validateScenario(scenario);
    simulatorService.startScenario(scenario);
  }

  @DeleteMapping
  public void reset() {
    log.info("Reset the simulator requested");
    this.simulatorService.resetSimulation();
  }
}
