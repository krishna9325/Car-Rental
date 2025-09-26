package com.krishnaproject.admin.controller;

import com.krishnaproject.admin.client.CarClient;
import com.krishnaproject.admin.dto.CarDto;
import com.krishnaproject.admin.model.Car;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/admin")
public class CarController {

    @Autowired
    private CarClient carClient;

    @GetMapping("/cars")
    public List<Car> getAllCars() {
        return carClient.getAllCars();
    }

    @PostMapping("/cars")
    public Car addCar(@RequestBody CarDto carDto) {
        return carClient.addCar(carDto);
    }

    @PutMapping("/cars/{id}")
    public void updateCar(@PathVariable Long id, @RequestBody CarDto carDto) {
        carClient.updateCar(id, carDto);
    }

    @DeleteMapping("/cars/{id}")
    public void deleteCar(@PathVariable Long id) {
        carClient.deleteCar(id);
    }
}
