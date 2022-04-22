package at.ac.dse.simulatorservice.simulator.domain;

import java.time.LocalDateTime;
import java.util.Objects;

public record CarStateMom(String vin,
                          Long location,
                          Long speed,
                          String directionCode,
                          LocalDateTime timestamp) {

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CarStateMom that = (CarStateMom) o;
        return Objects.equals(vin, that.vin) && Objects.equals(location, that.location) && Objects.equals(speed, that.speed) && Objects.equals(directionCode, that.directionCode) && Objects.equals(timestamp, that.timestamp);
    }

    @Override
    public int hashCode() {
        return Objects.hash(vin, location, speed, directionCode, timestamp);
    }

    @Override
    public String toString() {
        return "CarStateMom{" +
                "vin='" + vin + '\'' +
                ", location=" + location +
                ", speed=" + speed +
                ", directionCode='" + directionCode + '\'' +
                ", timestamp=" + timestamp +
                '}';
    }
}
