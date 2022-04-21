package at.ac.dse.simulatorservice.simulator.domain;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Objects;

public record CarStateMom(String vin,
                          Long[] location,
                          Long speed,
                          LocalDateTime timestamp) {

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof CarStateMom)) return false;
        CarStateMom that = (CarStateMom) o;
        return Objects.equals(vin, that.vin) && Arrays.equals(location, that.location) && Objects.equals(speed, that.speed) && Objects.equals(timestamp, that.timestamp);
    }

    @Override
    public int hashCode() {
        int result = Objects.hash(vin, speed, timestamp);
        result = 31 * result + Arrays.hashCode(location);
        return result;
    }

    @Override
    public String toString() {
        return "CarStateMom{" +
                "vin='" + vin + '\'' +
                ", location=" + Arrays.toString(location) +
                ", speed=" + speed +
                ", timestamp=" + timestamp +
                '}';
    }
}
