package com.krishnaproject.carrentalservice.dto;

import com.krishnaproject.carrentalservice.entity.Car;
import jakarta.validation.constraints.NotBlank;
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

    public static void carToDto(CarWithCityDto carDto, Car car) {
        carDto.setId(car.getId());
        carDto.setCarName(car.getCarName());
        carDto.setBrand(car.getBrand());
        carDto.setPricePerDay(car.getPricePerDay());
        carDto.setCount(car.getCount());
        carDto.setDetails(car.getDetails());
        carDto.setImages(car.getImages());

        // Map specifications
        if (car.getSpecifications() != null) {
            SpecificationsDto specDto = new SpecificationsDto();
            specDto.setId(car.getSpecifications().getId());
            specDto.setEngine(car.getSpecifications().getEngine());
            specDto.setCc(car.getSpecifications().getCc());
            specDto.setTransmission(car.getSpecifications().getTransmission());
            specDto.setSeatingCapacity(car.getSpecifications().getSeatingCapacity());
            specDto.setFuelType(car.getSpecifications().getFuelType());

            carDto.setSpecifications(specDto);
        }

        if(car.getCity() != null) {
            CityDto cityDto = new CityDto();
            cityDto.setCityName(car.getCity().getCityName());
            cityDto.setPinCode(car.getCity().getPinCode());
            cityDto.setId(car.getCity().getId());
            carDto.setCity(cityDto);
        }
    }

}