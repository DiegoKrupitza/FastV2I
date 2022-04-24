package at.ac.tuwien.dse.flowcontrolservice.dto;

import java.util.Objects;

public record NearestTrafficLightStateDto(String color, Long remainingMilliseconds) {
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        NearestTrafficLightStateDto that = (NearestTrafficLightStateDto) o;
        return Objects.equals(color, that.color) && Objects.equals(remainingMilliseconds, that.remainingMilliseconds);
    }

    @Override
    public int hashCode() {
        return Objects.hash(color, remainingMilliseconds);
    }

    @Override
    public String toString() {
        return "NearestTrafficLightStateDto{" +
                "color='" + color + '\'' +
                ", remainingMilliseconds=" + remainingMilliseconds +
                '}';
    }
}
