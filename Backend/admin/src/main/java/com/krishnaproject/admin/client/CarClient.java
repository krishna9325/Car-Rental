package com.krishnaproject.admin.client;

import com.krishnaproject.admin.dto.CarDto;
import com.krishnaproject.admin.dto.CityDto;
import com.krishnaproject.admin.model.Car;
import com.krishnaproject.admin.model.City;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "car-service")
public interface CarClient {
    @GetMapping("/cars")
    List<Car> getAllCars();

    @GetMapping("/cars/{id}")
    Car getCarById(@PathVariable Long id);

    @PostMapping("/admin/cars")
    Car addCar(@RequestBody CarDto carDto);

    @PutMapping("/admin/cars/{id}")
    void updateCar(@PathVariable Long id, @RequestBody CarDto carDto);

    @DeleteMapping("/admin/cars/{id}")
    void deleteCar(@PathVariable Long id);

    @GetMapping("/cities")
    List<City> getAllCities();

    @PostMapping("/admin/cities")
    City addNewCity(@RequestBody CityDto cityDto);
}