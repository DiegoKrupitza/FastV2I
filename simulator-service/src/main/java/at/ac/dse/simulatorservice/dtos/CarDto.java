package at.ac.dse.simulatorservice.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.Min;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CarDto {

  @Length(min = 1)
  private String id;

  @Length(min = 1)
  private String oem;

  @Length(min = 1)
  private String model;

  @Min(0)
  private Long entryTime;

  @Min(0)
  private Long speed;

  @Min(0)
  private Long position;

  @Min(0)
  private Long destination;
}
