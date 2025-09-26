package com.krishnaproject.carrentalservice.controller;


import com.krishnaproject.carrentalservice.dto.CityDto;
import com.krishnaproject.carrentalservice.entity.City;
import com.krishnaproject.carrentalservice.service.CityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
public class CityController {

    @Autowired
    private CityService cityService;

    @GetMapping("/cars/cities")
    public ResponseEntity<List<City>> getAllCities() {
        List<City> cities = cityService.getAllCities();
        return new ResponseEntity<>(cities, HttpStatus.OK);
    }

    @PostMapping("/admin/cities")
    public ResponseEntity<City> addNewCity(@RequestBody CityDto cityDto) {
        City city = cityService.createCity(cityDto);
        return new ResponseEntity<>(city, HttpStatus.CREATED);
    }

}