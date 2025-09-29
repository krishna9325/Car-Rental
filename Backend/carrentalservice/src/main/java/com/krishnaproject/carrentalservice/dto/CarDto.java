package com.krishnaproject.carrentalservice.dto;

import com.krishnaproject.carrentalservice.entity.Car;
import com.krishnaproject.carrentalservice.entity.Specifications;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CarDto {
    @NotBlank(message = "Car name is required")
    private String carName;
    private double pricePerDay;
    private String details;
    private int count;
    private String brand;
    @NotNull(message = "City ID must be provided")
    private Long cityId;
    private SpecificationsDto specifications;
    private List<String> images;

    public static void carDtoToEntity(CarDto carDto, Car car) {
        car.setCarName(carDto.getCarName());
        car.setBrand(carDto.getBrand());
        car.setPricePerDay(carDto.getPricePerDay());
        car.setCount(carDto.getCount());
        car.setDetails(carDto.getDetails());
        car.setImages(carDto.getImages());

        // Map specifications
        if (carDto.getSpecifications() != null) {
            Specifications spec = car.getSpecifications() != null ?
                    car.getSpecifications() : new Specifications();
            if (carDto.getSpecifications().getId() != null) {
                spec.setId(carDto.getSpecifications().getId());
            }
            spec.setEngine(carDto.getSpecifications().getEngine());
            spec.setCc(carDto.getSpecifications().getCc());
            spec.setTransmission(carDto.getSpecifications().getTransmission());
            spec.setSeatingCapacity(carDto.getSpecifications().getSeatingCapacity());
            spec.setFuelType(carDto.getSpecifications().getFuelType());

            car.setSpecifications(spec);
        }
    }

}