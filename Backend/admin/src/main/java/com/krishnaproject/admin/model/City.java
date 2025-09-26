package com.krishnaproject.admin.model;

import lombok.*;

import java.util.List;

@Data
public class City {

    private Long id;
    private String cityName;
    private Long pinCode;
    private List<Car> cars;
}