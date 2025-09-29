package com.krishnaproject.admin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CarWithCityDto {
    private Long id;

    @NotBlank(message = "Car name is required")
    private String carName;
    private double pricePerDay;
    private String details;
    private int count;
    private String brand;
    private CityDto city;
    private SpecificationsDto specifications;
    private List<String> images;
}