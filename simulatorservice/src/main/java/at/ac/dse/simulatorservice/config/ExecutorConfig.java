package at.ac.dse.simulatorservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.concurrent.ConcurrentTaskExecutor;

import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

/**
 * @author Diego Krupitza
 * @version 1.0
 * @date 28.03.22
 */
@Configuration
@EnableScheduling
public class ExecutorConfig {
  @Bean
  public ConcurrentTaskExecutor getAsyncExecutor() {
    return new ConcurrentTaskExecutor(Executors.newFixedThreadPool(10));
  }
}
