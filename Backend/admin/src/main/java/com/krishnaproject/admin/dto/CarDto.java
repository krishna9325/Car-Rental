package com.krishnaproject.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CarDto {

    private String carName;
    private double pricePerDay;
    private String details;
    private int count;
    private String brand;
    private Long cityId;
    private SpecificationsDto specifications;
    private List<String> images;
}