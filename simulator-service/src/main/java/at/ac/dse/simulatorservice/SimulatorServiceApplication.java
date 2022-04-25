package at.ac.dse.simulatorservice;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
@OpenAPIDefinition(servers = @Server(),
        info =
@Info(title = "Simulator API", version = "1.0", description = "Simulator Employee API v1.0")
)
public class SimulatorServiceApplication {

  public static void main(String[] args) {
    SpringApplication.run(SimulatorServiceApplication.class, args);
  }

}
