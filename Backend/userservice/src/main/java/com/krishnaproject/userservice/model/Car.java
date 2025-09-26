package com.krishnaproject.userservice.model;

import lombok.Data;

import java.util.List;

@Data
public class Car {
    private Long id;
    private String carName;
    private double pricePerDay;
    private String details;
    private int count;
    private String brand;
    private City city;
    private Specifications specifications;
    private List<String> images;
}

