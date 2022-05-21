package at.ac.tuwien.dse.gateway;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import lombok.extern.log4j.Log4j2;
import org.springdoc.core.GroupedOpenApi;
import org.springdoc.core.SwaggerUiConfigParameters;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.gateway.route.RouteDefinition;
import org.springframework.cloud.gateway.route.RouteDefinitionLocator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Lazy;

import java.util.ArrayList;
import java.util.List;

@SpringBootApplication
@EnableDiscoveryClient
@OpenAPIDefinition(
    info =
        @Info(
            title = "GateWay API",
            version = "1.0"))
@Log4j2
public class GatewayApplication {

  public static void main(String[] args) {
    SpringApplication.run(GatewayApplication.class, args);
  }

  @Bean
  @Lazy(false)
  public List<GroupedOpenApi> apis(
      SwaggerUiConfigParameters swaggerUiConfigParameters, RouteDefinitionLocator locator) {
    List<GroupedOpenApi> groups = new ArrayList<>();
    List<RouteDefinition> definitions = locator.getRouteDefinitions().collectList().block();
    log.info(definitions.size());
    for (RouteDefinition definition : definitions) {
      log.info("id: " + definition.getId() + "  " + definition.getUri().toString());
    }
    definitions.stream()
        .filter(routeDefinition -> routeDefinition.getId().toLowerCase().matches(".*-service"))
        .forEach(
            routeDefinition -> {
              String name = routeDefinition.getId().toLowerCase().replace("-service", "");
              swaggerUiConfigParameters.addGroup(name);
              GroupedOpenApi.builder().pathsToMatch("/" + name + "/**").group(name).build();
            });
    return groups;
  }
}
