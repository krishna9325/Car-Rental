package com.krishnaproject.carrentalservice.dto;

import com.krishnaproject.carrentalservice.entity.Car;
import com.krishnaproject.carrentalservice.entity.Specifications;
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

            spec.setEngine(carDto.getSpecifications().getEngine());
            spec.setCc(carDto.getSpecifications().getCc());
            spec.setTransmission(carDto.getSpecifications().getTransmission());
            spec.setSeatingCapacity(carDto.getSpecifications().getSeatingCapacity());
            spec.setFuelType(carDto.getSpecifications().getFuelType());

            car.setSpecifications(spec);
        }
    }

}