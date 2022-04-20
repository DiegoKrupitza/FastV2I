package at.ac.dse.simulatorservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class SimulatorServiceApplication {

  public static void main(String[] args) {
    SpringApplication.run(SimulatorServiceApplication.class, args);
  }
}
