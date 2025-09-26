package com.krishnaproject.userservice.controller;

import com.krishnaproject.userservice.client.CarClient;
import com.krishnaproject.userservice.dto.CityDto;
import com.krishnaproject.userservice.model.City;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class CityController {

    @Autowired
    private CarClient carClient;
    @GetMapping("/Cities")
    public List<City> getAllCities() {
        return carClient.getAllCities();
    }
}
