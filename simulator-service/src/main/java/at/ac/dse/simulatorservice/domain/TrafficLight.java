package at.ac.dse.simulatorservice.domain;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.Min;

/** Describes a TrafficLight in our simulation */
@AllArgsConstructor
@NoArgsConstructor
@Data
public class TrafficLight {

  @Length(min = 1)
  @Schema(description = "ID of the traffic light", nullable = false, example = "T1")
  private String id;

  @Min(0)
  @Schema(description = "The position of the traffic light", nullable = false, example = "1000")
  private Long position;

  @Min(10)
  @Schema(description = "The scan distance of the traffic light", nullable = false, example = "200")
  private Long scanDistance;

  @Min(0)
  @Schema(
      description = "The entry delay in ms after when the first state change should be triggered",
      nullable = false,
      example = "1000")
  private Long entryDelay;

  @Min(1)
  @Schema(description = "How long a state holds in seconds", nullable = false, example = "10")
  private Long stateHoldSeconds;

  public Long getStateHoldInMs() {
    return this.stateHoldSeconds * 1000;
  }
}
