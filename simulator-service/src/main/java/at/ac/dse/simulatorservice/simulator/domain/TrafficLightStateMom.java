package at.ac.dse.simulatorservice.simulator.domain;

import java.time.LocalDateTime;
import java.util.Objects;


public record TrafficLightStateMom(String id,
                                   String color,
                                   Long remainingMilliseconds,
                                   LocalDateTime timestamp) {

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TrafficLightStateMom)) return false;
        TrafficLightStateMom that = (TrafficLightStateMom) o;
        return Objects.equals(id, that.id) && Objects.equals(color, that.color) && Objects.equals(remainingMilliseconds, that.remainingMilliseconds) && Objects.equals(timestamp, that.timestamp);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, color, remainingMilliseconds, timestamp);
    }

    @Override
    public String toString() {
        return "TrafficLightStateMom{" +
                "id='" + id + '\'' +
                ", color='" + color + '\'' +
                ", remainingMilliseconds=" + remainingMilliseconds +
                ", timestamp=" + timestamp +
                '}';
    }
}
