package at.ac.dse.simulatorservice.simulator.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum ColorState {
  RED("red"),
  GREEN("green");

  private final String name;

  @Override
  public String toString() {
    return "ColorState: " + name;
  }
}
