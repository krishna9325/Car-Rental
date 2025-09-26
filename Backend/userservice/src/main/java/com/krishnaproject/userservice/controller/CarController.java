package com.krishnaproject.userservice.controller;

import com.krishnaproject.userservice.client.CarClient;
import com.krishnaproject.userservice.model.Car;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/user")
public class CarController {

    @Autowired
    private CarClient carClient;

    @GetMapping("/cars")
    public List<Car> getAllCars() {
        return carClient.getAllCars();
    }

    @GetMapping("/cars/{id}")
    public Car getAllCars(@PathVariable Long id) {
        return carClient.getCarById(id);
    }

    @PutMapping("/cars/{id}/{carCount}")
    public void updateCar(@PathVariable Long id, @PathVariable int carCount) {
        carClient.updateCar(id, carCount);
    }
}
