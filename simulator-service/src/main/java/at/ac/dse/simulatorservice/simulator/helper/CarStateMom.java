package at.ac.dse.simulatorservice.simulator.helper;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CarStateMom {
  private String vin;
  private Long[] location;
  private Long speed;
  private LocalDateTime timestamp;
}
