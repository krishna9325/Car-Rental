package com.krishnaproject.carrentalservice.exception;

import com.krishnaproject.carrentalservice.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CityNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleCityNotFoundException(CityNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse(true, ex.getMessage(), HttpStatus.NOT_FOUND.value()));
    }

    @ExceptionHandler(CarNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleCarNotFoundException(CarNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse(true, ex.getMessage(), HttpStatus.NOT_FOUND.value()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(true, ex.getMessage(), HttpStatus.BAD_REQUEST.value()));
    }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex) {
        StringBuilder messages = new StringBuilder();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            messages.append(error.getDefaultMessage()).append("; ");
        }
        String message = !messages.isEmpty() ? messages.substring(0, messages.length() - 2) : "Validation failed";

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(true, message, HttpStatus.BAD_REQUEST.value()));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(true, "Request body is missing or invalid: " + ex.getMessage(),
                        HttpStatus.BAD_REQUEST.value()));
    }

    @ExceptionHandler(CityAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleCityAlreadyExists(CityAlreadyExistsException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ErrorResponse(true, e.getMessage(),
                        HttpStatus.CONFLICT.value()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse(true, "Unexpected error: " + ex.getMessage(),
                        HttpStatus.INTERNAL_SERVER_ERROR.value()));
    }
}
