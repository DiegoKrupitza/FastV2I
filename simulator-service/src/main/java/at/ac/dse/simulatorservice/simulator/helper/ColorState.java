package at.ac.dse.simulatorservice.simulator.helper;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum ColorState {
  RED("red"),
  GREEN("green");

  private final String name;
}
