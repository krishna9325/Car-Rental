package com.krishnaproject.admin.controller;

import com.krishnaproject.admin.client.CarClient;
import com.krishnaproject.admin.dto.CityDto;
import com.krishnaproject.admin.model.City;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class CityController {

    @Autowired
    private CarClient carClient;

    @GetMapping("/Cities")
    public List<City> getAllCities() {
        return carClient.getAllCities();
    }

    @PostMapping
    public City addNewCity(@RequestBody CityDto cityDto) {
        return carClient.addNewCity(cityDto);
    }

}