package at.ac.tuwien.dse.flowcontrolservice.dto;

import java.util.Arrays;
import java.util.Objects;

public record NearestTrafficLightDto(Long id, Long[] position) {

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof NearestTrafficLightDto that)) return false;
        return Objects.equals(id, that.id) && Arrays.equals(position, that.position);
    }

    @Override
    public int hashCode() {
        int result = Objects.hash(id);
        result = 31 * result + Arrays.hashCode(position);
        return result;
    }

    @Override
    public String toString() {
        return "NearestTrafficLightDto{" +
                "id=" + id +
                ", position=" + Arrays.toString(position) +
                '}';
    }
}
