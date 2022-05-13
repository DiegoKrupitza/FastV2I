package at.ac.tuwien.dse.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

  @Bean
  SecurityWebFilterChain webHttpSecurity(ServerHttpSecurity http) {
    http //
        .cors()
        .and() //
        .csrf(ServerHttpSecurity.CsrfSpec::disable) //
        .authorizeExchange() //
        .pathMatchers("/**") //
        .permitAll();

    return http.build();
  }
}
