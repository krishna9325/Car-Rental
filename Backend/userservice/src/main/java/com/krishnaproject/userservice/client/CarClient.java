package com.krishnaproject.userservice.client;
import com.krishnaproject.userservice.dto.CarDto;
import com.krishnaproject.userservice.model.Car;
import com.krishnaproject.userservice.model.City;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "car-service")
public interface CarClient {
    @GetMapping("/cars")
    List<Car> getAllCars();

    @GetMapping("/cars/{id}")
    Car getCarById(@PathVariable Long id);

    @PutMapping("/rent/cars/{id}/{count}")
    void updateCar(@PathVariable Long id, @PathVariable int count);

    @GetMapping("/cities")
    List<City> getAllCities();
}