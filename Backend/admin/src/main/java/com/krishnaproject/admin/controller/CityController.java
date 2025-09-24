package com.krishnaproject.admin.controller;

import com.krishnaproject.admin.dto.CityDto;
import com.krishnaproject.admin.dto.CityNameAndIdDto;
import com.krishnaproject.admin.entity.City;
import com.krishnaproject.admin.service.CityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/cities")
public class CityController {

    @Autowired
    private CityService cityService;

    @GetMapping
    public ResponseEntity<List<City>> getAllCities() {
        List<City> cities = cityService.getAllCities();
        return new ResponseEntity<>(cities, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<City> addNewCity(@RequestBody CityDto cityDto) {
        City city = cityService.createCity(cityDto);
        return new ResponseEntity<>(city, HttpStatus.CREATED);
    }

}