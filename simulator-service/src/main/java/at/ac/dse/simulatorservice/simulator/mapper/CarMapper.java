package at.ac.dse.simulatorservice.simulator.mapper;

import at.ac.dse.simulatorservice.domain.Car;
import at.ac.dse.simulatorservice.simulator.domain.CarStateMom;
import at.ac.dse.simulatorservice.simulator.domain.Direction;

import java.time.LocalDateTime;

public abstract class CarMapper {

  public static CarStateMom toCarStateMom(Car car, Direction direction) {
    return new CarStateMom(
        car.getVin(),
        new Long[] {car.getLocation(), 0L},
        car.getSpeed(),
        direction.getShortIdentifier(),
        LocalDateTime.now());
  }
}
