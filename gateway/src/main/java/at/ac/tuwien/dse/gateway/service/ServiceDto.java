package at.ac.tuwien.dse.gateway.service;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Describes the state of a service.
 *
 * @param name the name of the service.
 * @param up   <code>true</code> if the service is alive otherwise <code>false</code>.
 */
public record ServiceDto(@Schema(description = "Name of service") String name, @Schema(description = "True if service is alive, otherwise false") boolean up) {
}
