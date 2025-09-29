package com.krishnaproject.admin.controller;

import com.krishnaproject.admin.client.CarClient;
import com.krishnaproject.admin.dto.CarDto;
import com.krishnaproject.admin.dto.CarWithCityDto;
import com.krishnaproject.admin.model.Car;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/cars")
public class CarController {

    @Autowired
    private CarClient carClient;

    @GetMapping
    public ResponseEntity<List<Car>> getAllCars() {
        List<Car> cars = carClient.getAllCars();
        return ResponseEntity.ok(cars);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> addCar(@RequestBody CarDto carDto) {
        Car createdCar = carClient.addCar(carDto);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Car added successfully");
        response.put("data", createdCar);
        response.put("timestamp", LocalDateTime.now());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateCar(@PathVariable Long id, @RequestBody CarDto carDto) {
        System.out.println("From admin**********" + carDto.getSpecifications().getId());
        carClient.updateCar(id, carDto);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Car updated successfully");
        response.put("carId", id);
        response.put("timestamp", LocalDateTime.now());

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteCar(@PathVariable Long id) {
        carClient.deleteCar(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Car deleted successfully");
        response.put("carId", id);
        response.put("timestamp", LocalDateTime.now());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CarWithCityDto> getCarById(@PathVariable Long id) {
        CarWithCityDto carWithCityDto = carClient.getCarById(id);
        System.out.println(carWithCityDto);
        return ResponseEntity.ok(carWithCityDto);
    }
}