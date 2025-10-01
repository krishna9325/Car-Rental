package com.krishnaproject.carrentalservice.repository;

import com.krishnaproject.carrentalservice.entity.Car;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface CarRepository extends JpaRepository<Car, Long> {

    List<Car> findByCityId(Long cityId);

    // ADDED: Pessimistic write lock for atomic car count operations
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT c FROM Car c WHERE c.id = :id")
    Optional<Car> findByIdWithLock(@Param("id") Long id);

    @Query("SELECT c FROM Car c WHERE c.city.id = :cityId AND c.count > 0")
    List<Car> findAvailableCarsByCity(@Param("cityId") Long cityId);

    @Query("SELECT c FROM Car c WHERE c.city.id = :cityId AND " +
            "c.count > (SELECT COUNT(b) FROM Booking b WHERE b.car.id = c.id AND " +
            "b.status = 'CONFIRMED' AND " +
            "((b.startDate <= :endDate AND b.endDate >= :startDate)))")
    List<Car> findAvailableCarsByCityAndDateRange(
            @Param("cityId") Long cityId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}