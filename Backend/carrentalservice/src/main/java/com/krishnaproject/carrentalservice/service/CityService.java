package com.krishnaproject.carrentalservice.service;

import com.krishnaproject.carrentalservice.dto.CityDto;
import com.krishnaproject.carrentalservice.entity.City;
import com.krishnaproject.carrentalservice.repository.CityRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CityService {

    @Autowired
    private CityRepository cityRepository;
    @Autowired
    private ModelMapper modelMapper;

    public List<City> getAllCities() {
        return cityRepository.findAll();
    }

    public City createCity(CityDto cityDto) {
        City city = modelMapper.map(cityDto, City.class);
        return cityRepository.save(city);
    }
}