package at.ac.tuwien.dse.gateway.service;

/**
 * Interface which is responsible for checking health
 */
public interface HealthService {

    /**
     * Is the given service healthy
     * @param serviceName the name of the servcie
     * @param url the url
     * @return health object
     */
    ServiceDto getHealthStatus(String serviceName, String url);


}

/**
 * Helath checl response
 * @param status the health string
 */
record ServiceStatus(String status) {}
