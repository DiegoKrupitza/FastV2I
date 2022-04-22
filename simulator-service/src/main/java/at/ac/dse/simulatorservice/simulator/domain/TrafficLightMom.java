package at.ac.dse.simulatorservice.simulator.domain;


import java.util.Objects;

public record TrafficLightMom(String id,
                              Long scanDistance,
                              Long location) {

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TrafficLightMom that = (TrafficLightMom) o;
        return Objects.equals(id, that.id) && Objects.equals(scanDistance, that.scanDistance) && Objects.equals(location, that.location);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, scanDistance, location);
    }

    @Override
    public String toString() {
        return "TrafficLightMom{" +
                "id='" + id + '\'' +
                ", scanDistance=" + scanDistance +
                ", location=" + location +
                '}';
    }
}
