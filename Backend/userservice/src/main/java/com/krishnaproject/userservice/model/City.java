package com.krishnaproject.userservice.model;

import lombok.Data;

import java.util.List;

@Data
public class City {

    private Long id;
    private String cityName;
    private Long pinCode;
    private List<Car> cars;
}