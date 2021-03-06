package at.ac.dse.simulatorservice.simulator.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum Direction {
  TOP_TO_BOTTOM("NTS","NORTH TO SOUTH", -1L),
  BOTTOM_TO_TOP("STN","SOUTH TO NORTH", 1L);

  private final String shortIdentifier;
  private final String name;
  private final Long modificator;

  /**
   * Determine which direction the object is going from
   *
   * @param start the start position of the object
   * @param destination the destination we want to reach
   * @return the direction
   */
  public static Direction getFromStartAndDestination(Long start, Long destination) {
    if (start < destination) {
      return BOTTOM_TO_TOP;
    } else {
      return TOP_TO_BOTTOM;
    }
  }
}
