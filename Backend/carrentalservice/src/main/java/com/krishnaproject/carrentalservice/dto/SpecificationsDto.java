package com.krishnaproject.carrentalservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SpecificationsDto {
    private String engine;
    private int cc;
    private String transmission;
    private int seatingCapacity;
    private String fuelType;
}