package com.krishnaproject.admin.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(RuntimeException ex) {
        Map<String, Object> errorResponse = new HashMap<>();

        String message = ex.getMessage();
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;

        // Determine appropriate HTTP status based on error message
        if (message != null) {
            if (message.startsWith("Not Found:")) {
                status = HttpStatus.NOT_FOUND;
                message = message.substring("Not Found: ".length());
            } else if (message.startsWith("Bad Request:")) {
                status = HttpStatus.BAD_REQUEST;
                message = message.substring("Bad Request: ".length());
            } else if (message.startsWith("Unauthorized:")) {
                status = HttpStatus.UNAUTHORIZED;
                message = message.substring("Unauthorized: ".length());
            } else if (message.startsWith("Forbidden:")) {
                status = HttpStatus.FORBIDDEN;
                message = message.substring("Forbidden: ".length());
            } else if (message.startsWith("Conflict:")) {
                status = HttpStatus.CONFLICT;
                message = message.substring("Conflict: ".length());
            } else if (message.startsWith("Unprocessable Entity:")) {
                status = HttpStatus.UNPROCESSABLE_ENTITY;
                message = message.substring("Unprocessable Entity: ".length());
            } else if (message.startsWith("Service Unavailable:")) {
                status = HttpStatus.SERVICE_UNAVAILABLE;
                message = message.substring("Service Unavailable: ".length());
            } else if (message.startsWith("Bad Gateway:")) {
                status = HttpStatus.BAD_GATEWAY;
                message = message.substring("Bad Gateway: ".length());
            }
        }

        errorResponse.put("error", true);
        errorResponse.put("message", message != null ? message : "An error occurred");
        errorResponse.put("status", status.value());
        errorResponse.put("timestamp", LocalDateTime.now());

        return new ResponseEntity<>(errorResponse, status);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", true);
        errorResponse.put("message", "An unexpected error occurred: " + ex.getMessage());
        errorResponse.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        errorResponse.put("timestamp", LocalDateTime.now());

        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}