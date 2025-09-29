package com.krishnaproject.carrentalservice.repository;

import com.krishnaproject.carrentalservice.dto.CityNameAndIdDto;
import com.krishnaproject.carrentalservice.entity.Car;
import com.krishnaproject.carrentalservice.entity.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CityRepository extends JpaRepository<City, Long> {
    @Query("SELECT c FROM City city JOIN city.cars c WHERE city.id = :cityId AND c.count > 0")
    List<Car> findAvailableCarsByCityId(@Param("cityId") Long cityId);

    // Or fetch city with cars in one query
    @Query("SELECT c FROM City c LEFT JOIN FETCH c.cars WHERE c.id = :cityId")
    Optional<City> findCityWithCars(@Param("cityId") Long cityId);

    List<CityNameAndIdDto> findAllProjectedBy();

    Optional<City> findByPinCode(Long pinCode);
}