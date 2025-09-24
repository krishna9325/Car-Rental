package com.krishnaproject.admin.controller;

import com.krishnaproject.admin.dto.CarDto;
import com.krishnaproject.admin.entity.Car;
import com.krishnaproject.admin.service.CarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/admin/cars")
public class CarController {

    @Autowired
    private CarService carService;

    @GetMapping
    public List<Car> getAllCars() {
        return carService.getAllCars();
    }

    // Get a single car by ID
    @GetMapping("/{id}")
    public ResponseEntity<Car> getCarById(@PathVariable Long id) {
        Car car = carService.getCarById(id);
        return new ResponseEntity<>(car, HttpStatus.OK);
    }

    // Add a new car
    @PostMapping
    public ResponseEntity<Car> addCar(@RequestBody CarDto carDto) {
        Car car = carService.createCar(carDto);
        return new ResponseEntity<>(car, HttpStatus.CREATED);
    }
    @GetMapping("/city/{id}")
    public ResponseEntity<List<Car>> getCarByCity(@PathVariable Long id) {
        return ResponseEntity.ok(carService.getCarsByCity(id));
    }

    @GetMapping("/city/{id}/available")
    public ResponseEntity<List<Car>> getAvailableCarsByCity(@PathVariable Long id) {
        return ResponseEntity.ok(carService.getAvailableCarsByCity(id));
    }


    // Update an existing car
    @PutMapping("/{id}")
    public ResponseEntity<String> updateCar(@PathVariable Long id, @RequestBody CarDto carDto) {
        carService.updateCar(id, carDto);
        return new ResponseEntity<>("Car updated successfully", HttpStatus.OK);
    }

    // Delete a car
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCar(@PathVariable Long id) {
        carService.deleteCar(id);
        return new ResponseEntity<>("Car removed successfully", HttpStatus.OK);
    }
}
