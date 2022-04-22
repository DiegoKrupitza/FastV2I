package at.ac.tuwien.dse.flowcontrolservice.dto;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Objects;

public record CarStateDto(String vin,
                          Long[] location,
                          Long speed,
                          String directionCode,
                          LocalDateTime timestamp) {

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof CarStateDto)) return false;
        CarStateDto that = (CarStateDto) o;
        return Objects.equals(vin, that.vin) && Arrays.equals(location, that.location) && Objects.equals(speed, that.speed) && Objects.equals(directionCode, that.directionCode) && Objects.equals(timestamp, that.timestamp);
    }

    @Override
    public int hashCode() {
        int result = Objects.hash(vin, speed, directionCode, timestamp);
        result = 31 * result + Arrays.hashCode(location);
        return result;
    }

    @Override
    public String toString() {
        return "CarStateDto{" +
                "vin='" + vin + '\'' +
                ", location=" + Arrays.toString(location) +
                ", speed=" + speed +
                ", directionCode='" + directionCode + '\'' +
                ", timestamp=" + timestamp +
                '}';
    }
}