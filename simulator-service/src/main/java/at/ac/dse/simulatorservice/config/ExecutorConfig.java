package at.ac.dse.simulatorservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.concurrent.ConcurrentTaskExecutor;

import java.util.concurrent.Executors;

/** Configuration of the simulator executor. */
@Configuration
@EnableScheduling
public class ExecutorConfig {
  @Bean
  public ConcurrentTaskExecutor getAsyncExecutor() {
    return new ConcurrentTaskExecutor(Executors.newCachedThreadPool());
  }
}
