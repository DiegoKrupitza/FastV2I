package at.ac.dse.simulatorservice.excetion;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import javax.validation.ValidationException;

/** Responsible for handling errors in the application. */
@ControllerAdvice
@Slf4j
@RequiredArgsConstructor
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

  private final ObjectMapper objectMapper;

  @ExceptionHandler(ValidationException.class)
  protected ResponseEntity<Object> handleValidationError(RuntimeException ex, WebRequest request) {
    return handleExceptionWithStatus(ex, request, HttpStatus.BAD_REQUEST);
  }

  private ResponseEntity<Object> handleExceptionWithStatus(
      RuntimeException ex, WebRequest request, HttpStatus responseStatus) {
    log.error("Exception with status {} occurred: {}", responseStatus, ex.getMessage());
    String jsonResponse = generateErrorObject(ex, responseStatus);

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    return handleExceptionInternal(ex, jsonResponse, headers, responseStatus, request);
  }

  /**
   * Generate a json object with the error message
   *
   * @param ex the exception holding the error
   * @param responseStatus the status
   * @return the json object
   */
  private String generateErrorObject(RuntimeException ex, HttpStatus responseStatus) {
    ApiError value = ApiError.from(ex, responseStatus);
    try {
      return objectMapper.writeValueAsString(value);
    } catch (JsonProcessingException e) {
      log.error(e.getMessage());
    }
    return "";
  }
}
