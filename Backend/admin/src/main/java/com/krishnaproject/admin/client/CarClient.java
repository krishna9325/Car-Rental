package com.krishnaproject.admin.client;

import com.krishnaproject.admin.config.FeignConfig;
import com.krishnaproject.admin.dto.CarDto;
import com.krishnaproject.admin.dto.CarWithCityDto;
import com.krishnaproject.admin.dto.CityDto;
import com.krishnaproject.admin.model.Car;
import com.krishnaproject.admin.model.City;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "car-service", configuration = FeignConfig.class)
public interface CarClient {
    @GetMapping("/cars/public")
    List<Car> getAllCars();

    @GetMapping("/cars/public/{id}")
    CarWithCityDto getCarById(@PathVariable Long id);

    @PostMapping("/cars/admin")
    Car addCar(@RequestBody CarDto carDto);

    @PutMapping("/cars/admin/{id}")
    void updateCar(@PathVariable Long id, @RequestBody CarDto carDto);

    @DeleteMapping("/cars/admin/{id}")
    void deleteCar(@PathVariable Long id);

    @GetMapping("/cars/public/cities")
    List<City> getAllCities();

    @PostMapping("/cars/admin/cities")
    City addNewCity(@RequestBody CityDto cityDto);
}