package at.ac.tuwien.dse.gateway;

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
public class ServiceAvailableController {

    private final DiscoveryClient discoveryClient;

    private final List<String> serviceNames = List.of("ENTITY-SERVICE","TRACKING-SERVICE","SIMULATOR-SERVICE", "FLOWCONTROL-SERVICE");

    /**
     * Lists the health status of the services our gateway is interacting with.
     * @return the status of our services.
     */
    @GetMapping
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
 * @param name the name of the service.
 * @param up <code>true</code> if the service is alive otherwise <code>false</code>.
 */
record ServiceDto(String name, boolean up) { }