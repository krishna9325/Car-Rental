package com.krishnaproject.carrentalservice.service;

import com.krishnaproject.carrentalservice.dto.CarDto;
import com.krishnaproject.carrentalservice.dto.CarWithCityDto;
import com.krishnaproject.carrentalservice.entity.Car;
import com.krishnaproject.carrentalservice.entity.City;
import com.krishnaproject.carrentalservice.exception.CarNotFoundException;
import com.krishnaproject.carrentalservice.exception.CityNotFoundException;
import com.krishnaproject.carrentalservice.repository.CarRepository;
import com.krishnaproject.carrentalservice.repository.CityRepository;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.orm.jpa.JpaSystemException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
public class CarService {

    @Autowired
    private CarRepository carRepository;
    @Autowired
    private CityRepository cityRepository;
    @Autowired
    private RedissonClient redissonClient;

    public List<Car> getAllCars() {
        return carRepository.findAll();
    }

    public CarWithCityDto getCarById(Long id) {
        Optional<Car> car = carRepository.findById(id);
        if(car.isPresent()) {
            CarWithCityDto carWithCityDto = new CarWithCityDto();
            CarWithCityDto.carToDto(carWithCityDto, car.get());
            System.out.println(carWithCityDto);
            return carWithCityDto;
        } else {
            throw new CarNotFoundException("Car with ID " + id + " not found.");
        }
    }

    public Car createCar(CarDto carDto) {
        Car car = new Car();
        CarDto.carDtoToEntity(carDto, car);

        // handle city safely
        if (carDto.getCityId() != null) {
            City city = cityRepository.findById(carDto.getCityId())
                    .orElseThrow(() -> new CityNotFoundException("City with ID " + carDto.getCityId() + " not found."));
            car.setCity(city);
        } else {
            throw new IllegalArgumentException("City information must be provided.");
        }

        try {
            return carRepository.save(car);
        } catch (DataIntegrityViolationException | JpaSystemException e) {
            throw new IllegalArgumentException("Failed to update car due to data integrity violation: " + e.getMessage());
        }
    }


    @Transactional
    public void updateCar(Long id, CarDto carDto) {
        if (!carRepository.existsById(id)) {
            throw new CarNotFoundException("Car with ID " + id + " not found.");
        }

        String lockKey = "car:lock:" + id;
        RLock lock = redissonClient.getLock(lockKey);

        try {
            if (lock.tryLock(5, 10, TimeUnit.SECONDS)) {
                Car car = new Car();
                car.setId(id);
                CarDto.carDtoToEntity(carDto, car);

                if (carDto.getCityId() != null) {
                    City city = cityRepository.findById(carDto.getCityId())
                            .orElseThrow(() -> new CityNotFoundException("City not found"));
                    car.setCity(city);
                }

                carRepository.save(car);
            } else {
                throw new RuntimeException("Could not acquire lock for admin update");
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } finally {
            if (lock.isHeldByCurrentThread()) lock.unlock();
        }
    }

    public List<Car> getAvailableCarsByDateRange(Long cityId, LocalDate startDate, LocalDate endDate) {
        if (!cityRepository.existsById(cityId)) {
            throw new CityNotFoundException("City with ID " + cityId + " not found");
        }

        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Start date must be before end date");
        }

        return carRepository.findAvailableCarsByCityAndDateRange(cityId, startDate, endDate);
    }

    public void deleteCar(Long id) {
        if (carRepository.existsById(id)) {
            carRepository.deleteById(id);
        } else {
            throw new CarNotFoundException("Car with ID " + id + " not found.");
        }
    }

    public List<Car> getCarsByCity(Long cityId) {
        // First verify city exists
        if (!cityRepository.existsById(cityId)) {
            throw new CityNotFoundException("City with ID " + cityId + " not found");
        }

        List<Car> cars = carRepository.findByCityId(cityId);

        // Check if any cars exist for this city
        if (cars.isEmpty()) {
            throw new CarNotFoundException("No cars found for city with ID " + cityId);
        }

        return cars;
    }

    public List<Car> getAvailableCarsByCity(Long cityId) {
        // First verify city exists
        if (!cityRepository.existsById(cityId)) {
            throw new CityNotFoundException("City with ID " + cityId + " not found");
        }

        List<Car> availableCars = carRepository.findAvailableCarsByCity(cityId);

        // Check if any available cars exist for this city
        if (availableCars.isEmpty()) {
            throw new CarNotFoundException("No available cars found for city with ID " + cityId);
        }

        return availableCars;
    }
}