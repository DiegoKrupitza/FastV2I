package at.ac.tuwien.dse.flowcontrolservice.dto;

import java.util.Objects;

public record NearestTrafficLightDto(String id, Long location, Long scanDistance) {

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        NearestTrafficLightDto that = (NearestTrafficLightDto) o;
        return Objects.equals(id, that.id) && Objects.equals(location, that.location) && Objects.equals(scanDistance, that.scanDistance);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, location, scanDistance);
    }

    @Override
    public String toString() {
        return "NearestTrafficLightDto{" +
                "id=" + id +
                ", location=" + location +
                ", scanDistance=" + scanDistance +
                '}';
    }
}
