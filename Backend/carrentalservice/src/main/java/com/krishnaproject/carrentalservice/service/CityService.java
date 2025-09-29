package com.krishnaproject.carrentalservice.service;

import com.krishnaproject.carrentalservice.dto.CityDto;
import com.krishnaproject.carrentalservice.entity.City;
import com.krishnaproject.carrentalservice.exception.CityAlreadyExistsException;
import com.krishnaproject.carrentalservice.repository.CityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CityService {

    @Autowired
    private CityRepository cityRepository;

    public List<City> getAllCities() {
        return cityRepository.findAll();
    }

    public City createCity(CityDto cityDto) {
        Optional<City> existingCity = cityRepository.findByPinCode(cityDto.getPinCode());

        if (existingCity.isPresent()) {
            throw new CityAlreadyExistsException(
                    "City with pin-code " + cityDto.getPinCode() + " already exists: "
                            + existingCity.get().getCityName()
            );
        }

        City city = new City();
        city.setCityName(cityDto.getCityName());
        city.setPinCode(cityDto.getPinCode());

        return cityRepository.save(city);
    }
}