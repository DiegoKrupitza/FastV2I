package at.ac.tuwien.dse.flowcontrolservice.service;

import at.ac.tuwien.dse.flowcontrolservice.config.FlowControlProperties;
import at.ac.tuwien.dse.flowcontrolservice.dto.CarStateDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FlowControlService {

  private final FlowControlProperties flowControlProperties;

  public Long getAdvisedSpeed(CarStateDto car) {
    // TODO: logic
    return car.speed();
  }
}
