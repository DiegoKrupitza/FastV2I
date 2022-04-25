package at.ac.dse.simulatorservice.simulator.mapper;

import at.ac.dse.simulatorservice.domain.Car;
import at.ac.dse.simulatorservice.simulator.domain.CarMom;
import at.ac.dse.simulatorservice.simulator.domain.CarStateMom;
import at.ac.dse.simulatorservice.simulator.domain.Direction;

import java.time.LocalDateTime;

/** Interface that is responsible for mapping various carobjects. */
public interface CarMapper {

  /** Maps a {@link Car} to a {@link CarMom} */
  static CarMom toCarMom(Car car) {
    return new CarMom(car.getVin(), car.getOem(), car.getModel());
  }

  /** Maps a {@link Car} with a given {@link Direction} to a {@link CarStateMom} */
  static CarStateMom toCarStateMom(Car car, Direction direction) {
    return new CarStateMom(
        car.getVin(),
        car.getLocation(),
        car.getSpeed(),
        direction.getShortIdentifier(),
        LocalDateTime.now());
  }
}
