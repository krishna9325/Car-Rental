package com.krishnaproject.carrentalservice.controller;

import com.krishnaproject.carrentalservice.dto.CarDto;
import com.krishnaproject.carrentalservice.dto.CarWithCityDto;
import com.krishnaproject.carrentalservice.dto.SpecificationsDto;
import com.krishnaproject.carrentalservice.entity.Car;
import com.krishnaproject.carrentalservice.service.CarService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cars")
public class CarController {

    @Autowired
    private CarService carService;

    @GetMapping("/public")
    public List<Car> getAllCars() {
        return carService.getAllCars();
    }

    // Get a single car by ID
    @GetMapping("/public/{id}")
    public ResponseEntity<CarWithCityDto> getCarById(@PathVariable Long id) {
        CarWithCityDto carWithCityDto = carService.getCarById(id);
        System.out.println(carWithCityDto);
        return new ResponseEntity<>(carWithCityDto, HttpStatus.OK);
    }

    @GetMapping("/public/city/{id}")
    public ResponseEntity<List<Car>> getCarByCity(@PathVariable Long id) {
        return ResponseEntity.ok(carService.getCarsByCity(id));
    }

    @GetMapping("/public/city/{id}/available")
    public ResponseEntity<List<Car>> getAvailableCarsByCity(@PathVariable Long id) {
        return ResponseEntity.ok(carService.getAvailableCarsByCity(id));
    }

    // Add a new car
    @PostMapping("/admin")
    public ResponseEntity<Car> addCar(@Valid @RequestBody CarDto carDto) {
        Car car = carService.createCar(carDto);
        return new ResponseEntity<>(car, HttpStatus.CREATED);
    }

    // Update an existing car
    @PutMapping("/admin/{id}")
    public ResponseEntity<String> updateCar(@PathVariable Long id, @Valid @RequestBody CarDto carDto) {
        System.out.println("Specification DTO id: " + carDto.getSpecifications().getId());
        carService.updateCar(id, carDto);
        return new ResponseEntity<>("Car updated successfully", HttpStatus.OK);
    }

    // Delete a car
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<String> deleteCar(@PathVariable Long id) {
        carService.deleteCar(id);
        return new ResponseEntity<>("Car removed successfully", HttpStatus.OK);
    }
}
