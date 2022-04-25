package at.ac.dse.simulatorservice.simulator;

import at.ac.dse.simulatorservice.config.SimulatorProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.core.FanoutExchange;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

/** Base class for objects in our simulation. */
@RequiredArgsConstructor
public abstract class SimulatorBase implements Runnable {

  private final SimulatorProperties simulatorProperties;
  private final RabbitTemplate rabbitTemplate;
  private final FanoutExchange fanout;
  private final boolean timelapse;
  private boolean stopped = false;

  /**
   * The setup that is performed before the main loop starts
   *
   * @throws InterruptedException in case of an interrupt
   */
  abstract void setup() throws InterruptedException;

  /**
   * This code will be executed over and over until an interrupt is triggered
   *
   * @throws InterruptedException in case of an interrupt
   */
  abstract void loopBody() throws InterruptedException;

  @Override
  public void run() {
    try {
      setup();

      while (!isInterrupted() && !stopped) {
        loopBody();
      }

    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
    }
  }

  /**
   * Is the current thread interrupted or not.
   *
   * @return <code>true</code> if interrupted otherwise <code>false</code>
   */
  boolean isInterrupted() {
    return Thread.currentThread().isInterrupted();
  }

  /**
   * Adjusts the time based on the timelapse
   *
   * @param timeInMs the time in reality we want to adjust in case timelapse is enabled
   * @return the adjusted time if timelapse is enabled otherwise it stays the same
   */
  Long adjustedTime(Long timeInMs) {
    return this.timelapse ? timeInMs / this.simulatorProperties.getTimelapseDivider() : timeInMs;
  }

  SimulatorProperties getSimulatorProperties() {
    return simulatorProperties;
  }

  RabbitTemplate getRabbitTemplate() {
    return rabbitTemplate;
  }

  public FanoutExchange getFanout() {
    return fanout;
  }

  boolean isTimelapse() {
    return timelapse;
  }

  void stop() {
    this.stopped = true;
  }
}
