package com.krishnaproject.admin.service;

import com.krishnaproject.admin.dto.CityDto;
import com.krishnaproject.admin.dto.CityNameAndIdDto;
import com.krishnaproject.admin.entity.City;
import com.krishnaproject.admin.repository.CityRepository;
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