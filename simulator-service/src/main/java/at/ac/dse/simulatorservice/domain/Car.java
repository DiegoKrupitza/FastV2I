package at.ac.dse.simulatorservice.domain;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.Min;

/** Describes a car in our simulation */
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Car {

  @Length(min = 1)
  @Schema(description = "The vin of the car", example = "V1")
  private String vin;

  @Length(min = 1)
  @Schema(description = "The oem of the car", example = "Tesla")
  private String oem;

  @Length(min = 1)
  @Schema(description = "The model of the car", example = "Model 3")
  private String model;

  @Min(0)
  @Schema(
      description = "After how many ms the car should enter the scene",
          example = "1000")
  private Long entryTime;

  @Min(0)
  @Schema(description = "The speed of the car", example = "50")
  private Long speed;

  @Min(0)
  @Schema(description = "The start location of the car", example = "0")
  private Long location;

  @Min(0)
  @Schema(description = "The desired destination of the car", example = "1800")
  private Long destination;
}
