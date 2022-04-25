package at.ac.tuwien.dse.flowcontrolservice.dto;

import java.time.LocalDateTime;

import java.util.Objects;

/**
 * This dto resembles the car state that is read from the MoM.
 * @param vin the vin of the car.
 * @param location the current location of the car.
 * @param speed the current speed the car is driving.
 * @param directionCode the direction of the car.
 * @param timestamp the timestamp the data point was generated.
 */
public record CarStateDto(String vin,
                          Long location,
                          Long speed,
                          String directionCode,
                          LocalDateTime timestamp) {

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CarStateDto that = (CarStateDto) o;
        return Objects.equals(vin, that.vin) && Objects.equals(location, that.location) && Objects.equals(speed, that.speed) && Objects.equals(directionCode, that.directionCode) && Objects.equals(timestamp, that.timestamp);
    }

    @Override
    public int hashCode() {
        return Objects.hash(vin, location, speed, directionCode, timestamp);
    }

    @Override
    public String toString() {
        return "CarStateDto{" +
                "vin='" + vin + '\'' +
                ", location=" + location +
                ", speed=" + speed +
                ", directionCode='" + directionCode + '\'' +
                ", timestamp=" + timestamp +
                '}';
    }
}