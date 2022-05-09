package at.ac.dse.simulatorservice.excetion;

import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

public record ApiError(Integer status, String description, String time) {

    /**
     * Generates a ApiError object from the given exception and the response status
     *
     * @param e the exception to wrap
     * @param responseStatus the status
     * @return the newly created ApiError object
     */
    public static ApiError from(Exception e, HttpStatus responseStatus) {
        return ApiError.from(e.getMessage(), responseStatus);
    }

    /**
     * Generates a ApiError object from the given message and the response status
     *
     * @param msg the message to wrap
     * @param responseStatus the status
     * @return the newly created ApiError object
     */
    public static ApiError from(String msg, HttpStatus responseStatus) {
        return new ApiError(responseStatus.value(), msg, LocalDateTime.now(ZoneOffset.UTC).toString());
    }
}

