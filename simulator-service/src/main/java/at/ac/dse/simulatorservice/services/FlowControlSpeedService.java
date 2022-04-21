package at.ac.dse.simulatorservice.services;

import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class FlowControlSpeedService {

  // is this thread safe and all that fancy stuff????
  private ConcurrentHashMap<String, Long> advisedSpeed = new ConcurrentHashMap<>();

  /**
   * Sets the speed the flow control service is advising to the car with the given vin
   *
   * @param vin the vin of the car
   * @param speed the advised speed
   */
  public void set(String vin, Long speed) {
    this.advisedSpeed.put(vin, speed);
  }

  /**
   * Gets the advised speed for a given car.
   *
   * @param vin the vin of the car
   * @return the advised speed wrapped in {@link Optional}
   */
  public Optional<Long> get(String vin) {
    return Optional.ofNullable(this.advisedSpeed.get(vin));
  }

  /** Reset all the values */
  public void reset() {
    this.advisedSpeed = new ConcurrentHashMap<>();
  }
}
