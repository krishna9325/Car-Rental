package com.krishnaproject.carrentalservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ErrorResponse {
    private boolean error;
    private String message;
    private int status;
}
