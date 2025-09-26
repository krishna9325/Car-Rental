package com.krishnaproject.userservice.model;

import lombok.Data;

@Data
public class Specifications {
    private Long id;
    private String engine;
    private int cc;
    private String transmission;
    private int seatingCapacity;
    private String fuelType;
}