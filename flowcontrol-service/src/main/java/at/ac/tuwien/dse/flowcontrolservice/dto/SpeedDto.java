package at.ac.tuwien.dse.flowcontrolservice.dto;

/**
 * The MoM response object to communicate at what speed a given car has to drive.
 * @param vin the vin of the car.
 * @param speed the speed we advise driving.
 */
public record SpeedDto(String vin, Long speed) {}