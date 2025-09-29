package com.krishnaproject.carrentalservice.exception;

public class CityAlreadyExistsException extends RuntimeException {
    public CityAlreadyExistsException(String message) {
        super(message);
    }
}