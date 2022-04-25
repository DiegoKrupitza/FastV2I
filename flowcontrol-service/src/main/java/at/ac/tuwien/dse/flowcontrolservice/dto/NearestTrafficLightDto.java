package at.ac.tuwien.dse.flowcontrolservice.dto;

import java.util.Objects;

/**
 * This dto is responsible for wrapping a response from the entity-service
 * @param id the id of the traffic light
 * @param location the location of the traffic light
 * @param scanDistance the scan distance of the traffic light
 */
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
