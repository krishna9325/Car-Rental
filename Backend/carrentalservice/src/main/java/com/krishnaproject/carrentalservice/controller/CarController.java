package com.krishnaproject.carrentalservice.controller;

import com.krishnaproject.carrentalservice.dto.CarDto;
import com.krishnaproject.carrentalservice.entity.Car;
import com.krishnaproject.carrentalservice.service.CarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CarController {

    @Autowired
    private CarService carService;

    @GetMapping("/cars")
    public List<Car> getAllCars() {
        return carService.getAllCars();
    }

    // Get a single car by ID
    @GetMapping("/cars/{id}")
    public ResponseEntity<Car> getCarById(@PathVariable Long id) {
        Car car = carService.getCarById(id);
        return new ResponseEntity<>(car, HttpStatus.OK);
    }

    @GetMapping("/cars/city/{id}")
    public ResponseEntity<List<Car>> getCarByCity(@PathVariable Long id) {
        return ResponseEntity.ok(carService.getCarsByCity(id));
    }

    @GetMapping("/cars/city/{id}/available")
    public ResponseEntity<List<Car>> getAvailableCarsByCity(@PathVariable Long id) {
        return ResponseEntity.ok(carService.getAvailableCarsByCity(id));
    }

    // Add a new car
    @PostMapping("/admin/cars")
    public ResponseEntity<Car> addCar(@RequestBody CarDto carDto) {
        Car car = carService.createCar(carDto);
        return new ResponseEntity<>(car, HttpStatus.CREATED);
    }

    // Update an existing car
    @PutMapping("/admin/cars/{id}")
    public ResponseEntity<String> updateCar(@PathVariable Long id, @RequestBody CarDto carDto) {
        carService.updateCar(id, carDto);
        return new ResponseEntity<>("Car updated successfully", HttpStatus.OK);
    }

    // Delete a car
    @DeleteMapping("/admin/cars/{id}")
    public ResponseEntity<String> deleteCar(@PathVariable Long id) {
        carService.deleteCar(id);
        return new ResponseEntity<>("Car removed successfully", HttpStatus.OK);
    }
}
