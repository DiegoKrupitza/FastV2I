package at.ac.dse.simulatorservice.simulator.helper;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class TrafficLightStateMom {

  private String id;
  private String color;
  private Long remainingMilliseconds;
  private LocalDateTime timestamp;
}
