package com.krishnaproject.admin.repository;

import com.krishnaproject.admin.entity.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarRepository extends JpaRepository<Car, Long> {
    List<Car> findByCityId(Long cityId);
    @Query("SELECT c FROM Car c WHERE c.city.id = :cityId AND c.count > 0")
    List<Car> findAvailableCarsByCity(@Param("cityId") Long cityId);

}
