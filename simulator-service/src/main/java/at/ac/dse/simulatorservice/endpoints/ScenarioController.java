package at.ac.dse.simulatorservice.endpoints;

import at.ac.dse.simulatorservice.dtos.ScenarioDto;
import at.ac.dse.simulatorservice.services.SimulatorService;
import at.ac.dse.simulatorservice.services.ValidatorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/simulator")
@RequiredArgsConstructor
public class ScenarioController {

  private final SimulatorService simulatorService;
  private final ValidatorService validatorService;

  @GetMapping
  public boolean simulationActive() {
    // TODO: find a way to get if threads are simulating or not from executor
    return false;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public void setScenario(@RequestBody ScenarioDto scenario) {
    validatorService.validateScenario(scenario);
    simulatorService.startScenario(scenario);
  }

  @DeleteMapping
  public void reset() {
    this.simulatorService.resetSimulation();
  }
}
