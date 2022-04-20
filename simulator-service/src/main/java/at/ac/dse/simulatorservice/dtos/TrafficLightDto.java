package at.ac.dse.simulatorservice.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.Min;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class TrafficLightDto {

  @Length(min = 1)
  private String id;

  @Min(0)
  private Long position;

  @Min(1)
  private Long scanDistance;

  @Min(0)
  private Long entryDelay;

  @Min(1)
  private Long stateHoldSeconds;
}
