package at.ac.dse.simulatorservice.simulator.domain;

import java.util.Arrays;
import java.util.Objects;

public record TrafficLightMom(String id,
                              Long scanDistance,
                              Long[] location) {

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TrafficLightMom)) return false;
        TrafficLightMom that = (TrafficLightMom) o;
        return Objects.equals(id, that.id) && Objects.equals(scanDistance, that.scanDistance) && Arrays.equals(location, that.location);
    }

    @Override
    public int hashCode() {
        int result = Objects.hash(id, scanDistance);
        result = 31 * result + Arrays.hashCode(location);
        return result;
    }

    @Override
    public String toString() {
        return "TrafficLightMom{" +
                "id='" + id + '\'' +
                ", scanDistance=" + scanDistance +
                ", location=" + Arrays.toString(location) +
                '}';
    }
}
