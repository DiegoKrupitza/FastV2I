package at.ac.dse.simulatorservice.endpoints;

import at.ac.dse.simulatorservice.simulator.CarSimulator;
import at.ac.dse.simulatorservice.simulator.TrafficLightSimulator;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.core.task.TaskExecutor;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.concurrent.ConcurrentTaskExecutor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Future;

@RestController
@RequiredArgsConstructor
public class ScenarioController {

  private final RabbitTemplate rabbitTemplate;
  private final ConcurrentTaskExecutor taskExecutor;
  private final List<Future<?>> threads = new ArrayList<>();

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public void setScenario() {

    // TODO: logic to create the threads
    threads.add(this.taskExecutor.submit(new CarSimulator(rabbitTemplate)));
    threads.add(this.taskExecutor.submit(new TrafficLightSimulator(rabbitTemplate)));
  }

  @DeleteMapping
  public void reset() {

    // TODO: logic to kill the threads
    this.threads.forEach(item -> item.cancel(true));
  }
}
