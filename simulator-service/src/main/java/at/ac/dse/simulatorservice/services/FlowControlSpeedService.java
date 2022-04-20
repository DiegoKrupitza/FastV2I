package at.ac.dse.simulatorservice.services;

import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class FlowControlSpeedService {

  // TODO: is this thread safe and all that fancy stuff????
  private ConcurrentHashMap<String, Long> advisedSpeed = new ConcurrentHashMap<>();

  public void set(String vin, Long speed) {
    this.advisedSpeed.put(vin, speed);
  }

  public Optional<Long> get(String vin) {
    return Optional.ofNullable(this.advisedSpeed.get(vin));
  }

  public void reset() {
    this.advisedSpeed = new ConcurrentHashMap<>();
  }
}
