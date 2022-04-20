package at.ac.dse.simulatorservice.simulator.helper;

import at.ac.dse.simulatorservice.dtos.CarDto;

import java.time.LocalDateTime;

public abstract class CarMapper {

  public static CarStateMom toCarStateMom(CarDto carDto) {
    return new CarStateMom(
        carDto.getVin(),
        new Long[] {carDto.getLocation(), 0L},
        carDto.getSpeed(),
        LocalDateTime.now());
  }
}
