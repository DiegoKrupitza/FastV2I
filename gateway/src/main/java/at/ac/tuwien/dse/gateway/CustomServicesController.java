package at.ac.tuwien.dse.gateway;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RequestMapping("services")
@RequiredArgsConstructor
@Slf4j
@RestController
public class CustomServicesController {

    private final DiscoveryClient discoveryClient;

    private final List<String> serviceNames = List.of("ENTITY-SERVICE","TRACKING-SERVICE","SIMULATOR-SERVICE", "FLOWCONTROL-SERVICE");

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


record ServiceDto(String name, boolean up) { }