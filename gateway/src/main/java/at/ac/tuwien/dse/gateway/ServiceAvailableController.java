package at.ac.tuwien.dse.gateway;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Controller for the service resource
 */
@RequestMapping("services")
@RequiredArgsConstructor
@Slf4j
@RestController
@CrossOrigin
@Tag(name = "ServiceAvailableController", description = "Endpoint for getting status information about services")
public class ServiceAvailableController {

    private final DiscoveryClient discoveryClient;

    private final List<String> serviceNames = List.of("ENTITY-SERVICE", "TRACKING-SERVICE", "SIMULATOR-SERVICE", "FLOWCONTROL-SERVICE");

    /**
     * Lists the health status of the services our gateway is interacting with.
     *
     * @return the status of our services.
     */
    @GetMapping
    @Operation(summary = "Get status of all services",
            description = "Returns the status of all services",
            responses = @ApiResponse(responseCode = "200", description = "Successful response",
                    content = @Content(mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = ServiceDto.class)))))
    public Stream<ServiceDto> getAllHealthyServices() {

        return serviceNames
                .stream() //
                .collect( //
                        Collectors.toMap(Function.identity(), discoveryClient::getInstances) //
                ) //
                .entrySet() //
                .stream() //
                .map(item ->  //
                        new ServiceDto(item.getKey(), !CollectionUtils.isEmpty(item.getValue())) //
                );
    }

}

/**
 * Descirbes the state of a service.
 *
 * @param name the name of the service.
 * @param up   <code>true</code> if the service is alive otherwise <code>false</code>.
 */
record ServiceDto(@Schema(description = "Name of service") String name,@Schema(description = "True if service is alive, otherwise false") boolean up) {
}