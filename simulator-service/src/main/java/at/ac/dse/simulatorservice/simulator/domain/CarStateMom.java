package at.ac.dse.simulatorservice.simulator.domain;

import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.time.LocalDateTime;

@ToString
@EqualsAndHashCode
public record CarStateMom(String vin,
                          Long[] location,
                          Long speed,
                          String direction,
                          LocalDateTime timestamp) {

}
